
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Heart, 
  Send, 
  User,
  ChevronLeft,
  ChevronRight,
  Share 
} from 'lucide-react';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import { useToast } from '@/components/ui/use-toast';
import ChatWindow from '@/components/chat/ChatWindow';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface VideoData {
  id: string;
  listing_id: string;
  video_url: string;
  listing: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
  profile: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  created_at: string;
}

const QFeed = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState<{[key: string]: boolean}>({});

  const searchParams = new URLSearchParams(location.search);
  const productParam = searchParams.get('product');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('product_videos' as any)
          .select(`
            id,
            listing_id,
            video_url,
            listings:listing_id(id, title, price, images, user_id),
            profiles:user_id(id, full_name, avatar_url),
            created_at
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching videos:', error);
          return;
        }

        if (data) {
          const formattedData = data.map((item: any) => ({
            id: item.id,
            listing_id: item.listing_id,
            video_url: item.video_url,
            listing: item.listings,
            profile: item.profiles,
            created_at: item.created_at
          }));

          setVideos(formattedData);
          
          // If product param exists, find its index
          if (productParam) {
            const videoIndex = formattedData.findIndex(v => v.listing_id === productParam);
            if (videoIndex !== -1) {
              setCurrentIndex(videoIndex);
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [productParam]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Check follow status for all video creators
      for (const video of videos) {
        if (!video.profile?.id) continue;
        
        const { data, error } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', session.user.id)
          .eq('following_id', video.profile.id)
          .single();
        
        setIsFollowing(prev => ({
          ...prev,
          [video.profile.id]: !!data
        }));
      }
    };

    if (videos.length > 0) {
      checkFollowStatus();
    }
  }, [videos]);

  useEffect(() => {
    // Pause all videos first
    videoRefs.current.forEach((videoRef, index) => {
      if (videoRef && index !== currentIndex) {
        videoRef.pause();
      }
    });

    // Play current video
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex]?.play();
    }
  }, [currentIndex]);

  const handleVideoEnd = () => {
    // Go to next video when current one ends
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleChatWithSeller = (video: VideoData) => {
    setProductId(video.listing_id);
    setIsChatOpen(true);
  };

  const handleFollowToggle = async (profileId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate('/profile');
      return;
    }

    const isCurrentlyFollowing = isFollowing[profileId];

    if (isCurrentlyFollowing) {
      await supabase.rpc('unfollow_user', { following_uid: profileId });
      setIsFollowing(prev => ({ ...prev, [profileId]: false }));
      toast({ title: "Unfollowed successfully" });
    } else {
      await supabase.rpc('follow_user', { following_uid: profileId });
      setIsFollowing(prev => ({ ...prev, [profileId]: true }));
      toast({ title: "Followed successfully" });
    }
  };

  const handleShare = (video: VideoData) => {
    if (navigator.share) {
      navigator.share({
        title: video.listing.title,
        text: `Check out this product: ${video.listing.title}`,
        url: `${window.location.origin}/product/${video.listing_id}`
      }).catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/product/${video.listing_id}`);
      toast({ title: "Link copied to clipboard" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-16 h-screen flex items-center justify-center">
          <Skeleton className="h-full w-full max-w-md mx-auto" />
        </div>
        <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
        <Header />
        <div className="pt-20 pb-20 px-4 flex flex-col items-center justify-center h-[70vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">No videos yet</h2>
            <p className="text-muted-foreground mb-6">Be the first to share a product video!</p>
            <Button onClick={() => navigate('/sell')}>
              Sell Now
            </Button>
          </div>
        </div>
        <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-16 h-screen">
        <div className="relative h-full max-w-md mx-auto">
          {/* Video Player */}
          <div className="h-full w-full">
            {videos.map((video, index) => (
              <div 
                key={video.id} 
                className={`absolute inset-0 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={supabase.storage.from('product_videos').getPublicUrl(video.video_url).data.publicUrl}
                  className="h-full w-full object-cover"
                  loop
                  playsInline
                  autoPlay={index === currentIndex}
                  onEnded={handleVideoEnd}
                />
                
                {/* Video Overlay UI */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60">
                  {/* Product Info */}
                  <div className="absolute bottom-20 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg">{video.listing.title}</h3>
                    <p className="text-white text-xl font-bold">₹{video.listing.price}</p>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => navigate(`/product/${video.listing_id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                
                {/* Right sidebar icons */}
                <div className="absolute right-2 bottom-40 flex flex-col gap-6">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="bg-black/30 rounded-full p-2"
                    onClick={() => handleChatWithSeller(video)}
                  >
                    <MessageSquare className="h-7 w-7 text-white" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="bg-black/30 rounded-full p-2"
                    onClick={() => handleShare(video)}
                  >
                    <Share className="h-7 w-7 text-white" />
                  </motion.button>
                </div>
                
                {/* User Info */}
                <div className="absolute bottom-4 left-4 right-12 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <User className="h-6 w-6" />
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-white font-medium text-sm truncate">{video.profile?.full_name || 'User'}</p>
                  </div>
                  <Button 
                    variant={isFollowing[video.profile?.id] ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleFollowToggle(video.profile?.id)}
                    className={isFollowing[video.profile?.id] ? "border-white text-white" : ""}
                  >
                    {isFollowing[video.profile?.id] ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/20 p-2 rounded-r-full"
            onClick={handlePrevVideo}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/20 p-2 rounded-l-full"
            onClick={handleNextVideo}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
      
      <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
      
      {isChatOpen && (
        <ChatWindow 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          productId={productId} 
        />
      )}
    </div>
  );
};

export default QFeed;
