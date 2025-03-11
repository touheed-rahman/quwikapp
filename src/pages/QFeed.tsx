
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus, UserCheck, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";

interface VideoItem {
  id: string;
  listing_id: string;
  video_url: string;
  user_id: string;
  user_name: string;
  title: string;
  price: number;
  created_at: string;
}

const QFeed = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get current user
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    };
    getSession();
  }, []);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('product_videos')
        .select(`
          id,
          listing_id,
          video_url,
          created_at,
          listings!inner(
            title,
            price,
            user_id
          ),
          profiles!inner(
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching videos:", error);
        return;
      }

      if (data) {
        const formattedVideos = data.map(item => ({
          id: item.id,
          listing_id: item.listing_id,
          video_url: supabase.storage.from('product_videos').getPublicUrl(item.video_url).data.publicUrl,
          user_id: item.listings.user_id,
          user_name: item.profiles.full_name,
          title: item.listings.title,
          price: item.listings.price,
          created_at: item.created_at
        }));
        setVideos(formattedVideos);
        videoRefs.current = videoRefs.current.slice(0, formattedVideos.length);
      }
      setIsLoading(false);
    };

    fetchVideos();
  }, []);

  // Fetch following status for each seller
  useEffect(() => {
    if (!currentUserId || videos.length === 0) return;

    const fetchFollowingStatus = async () => {
      const sellerIds = [...new Set(videos.map(video => video.user_id))];
      
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', currentUserId)
        .in('following_id', sellerIds);

      if (error) {
        console.error("Error fetching following status:", error);
        return;
      }

      const followingStatus: Record<string, boolean> = {};
      sellerIds.forEach(id => {
        followingStatus[id] = false;
      });

      if (data) {
        data.forEach(follow => {
          followingStatus[follow.following_id] = true;
        });
      }

      setFollowingMap(followingStatus);
    };

    fetchFollowingStatus();
  }, [currentUserId, videos]);

  // Intersection Observer to play/pause videos
  useEffect(() => {
    if (videos.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(e => console.error("Video play error:", e));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach(videoEl => {
      if (videoEl) {
        observerRef.current?.observe(videoEl);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos, videoRefs]);

  const handleVideoClick = (videoEl: HTMLVideoElement) => {
    if (videoEl.paused) {
      videoEl.play().catch(e => console.error("Video play error:", e));
    } else {
      videoEl.pause();
    }
  };

  const handleChatWithSeller = async (userId: string, listingId: string) => {
    if (!currentUserId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat with the seller",
        variant: "destructive"
      });
      navigate('/profile');
      return;
    }

    if (currentUserId === userId) {
      toast({
        title: "Cannot chat with yourself",
        description: "This is your own listing",
        variant: "destructive"
      });
      return;
    }

    try {
      // Find existing conversation
      const { data: existingConversation, error: conversationError } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listingId)
        .eq('buyer_id', currentUserId)
        .eq('deleted', false) // Only get non-deleted conversations
        .maybeSingle();

      if (conversationError && conversationError.code !== 'PGRST116') {
        throw conversationError;
      }

      if (existingConversation) {
        navigate(`/chat/${existingConversation.id}`);
        return;
      }

      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          listing_id: listingId,
          buyer_id: currentUserId,
          seller_id: userId,
          deleted: false
        })
        .select()
        .single();

      if (createError) throw createError;
      navigate(`/chat/${newConversation.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive"
      });
      console.error('Chat error:', error);
    }
  };

  const handleFollowSeller = async (userId: string) => {
    if (!currentUserId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow this seller",
        variant: "destructive"
      });
      navigate('/profile');
      return;
    }

    if (currentUserId === userId) {
      toast({
        title: "Cannot follow yourself",
        description: "You cannot follow your own profile",
        variant: "destructive"
      });
      return;
    }

    try {
      if (followingMap[userId]) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', userId);

        setFollowingMap(prev => ({
          ...prev,
          [userId]: false
        }));

        toast({
          title: "Unfollowed",
          description: "You are no longer following this seller"
        });
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            following_id: userId
          });

        setFollowingMap(prev => ({
          ...prev,
          [userId]: true
        }));

        toast({
          title: "Following",
          description: "You are now following this seller"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive"
      });
      console.error('Follow error:', error);
    }
  };

  const handleShare = async (video: VideoItem) => {
    try {
      const url = `${window.location.origin}/product/${video.listing_id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: `Check out ${video.title} on Quwik!`,
          url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Product link copied to clipboard"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleProductClick = (listingId: string) => {
    navigate(`/product/${listingId}`);
  };

  const handleSellerProfile = (userId: string) => {
    navigate(`/seller/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-700 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 text-center">
        <Header />
        <h2 className="text-2xl font-bold mb-4">No videos available yet</h2>
        <p className="mb-8">Be the first to add a product video!</p>
        <Button onClick={() => navigate('/sell')}>
          Sell an item with video
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-black">
      <Header />
      <div className="h-full pt-16 pb-16 snap-y snap-mandatory overflow-y-scroll">
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className="h-screen w-full snap-start snap-always relative"
          >
            <video
              ref={el => videoRefs.current[index] = el}
              src={video.video_url}
              className="h-full w-full object-contain bg-black"
              loop
              playsInline
              muted
              onClick={(e) => handleVideoClick(e.target as HTMLVideoElement)}
            />
            
            {/* Video overlay with UI elements */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div onClick={() => handleProductClick(video.listing_id)}>
                <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">{video.title}</h3>
                <p className="text-white font-bold mb-3">${video.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center">
                <div 
                  className="flex items-center flex-1"
                  onClick={() => handleSellerProfile(video.user_id)}
                >
                  <Avatar className="h-8 w-8 mr-2 ring-1 ring-white">
                    <AvatarFallback className="bg-primary/30 text-white">
                      {video.user_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium">{video.user_name}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => handleShare(video)}
                >
                  <Share className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Side action buttons */}
            <div className="absolute right-4 bottom-24 flex flex-col gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/40 text-white hover:bg-white/30 h-12 w-12 rounded-full"
                onClick={() => handleChatWithSeller(video.user_id, video.listing_id)}
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/40 text-white hover:bg-white/30 h-12 w-12 rounded-full"
                onClick={() => handleFollowSeller(video.user_id)}
              >
                {followingMap[video.user_id] ? (
                  <UserCheck className="h-6 w-6" />
                ) : (
                  <UserPlus className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QFeed;
