
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSellerProfile = (id: string | undefined) => {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch seller profile
  const { data: profile } = useQuery({
    queryKey: ['seller-profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch seller's listings
  const { data: listings = [] } = useQuery({
    queryKey: ['seller-listings', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Check if current user is following the seller
  useEffect(() => {
    const checkFollowStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setCurrentUserId(user.id);
      
      const { data } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', id)
        .single();
      
      setIsFollowing(!!data);
    };
    
    checkFollowStatus();
  }, [id]);

  const handleFollow = async () => {
    if (!currentUserId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to follow sellers",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', id);
      } else {
        await supabase
          .from('follows')
          .insert([
            { follower_id: currentUserId, following_id: id }
          ]);
      }
      
      setIsFollowing(!isFollowing);
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing ? 
          "You have unfollowed this seller" : 
          "You are now following this seller"
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    }
  };

  return {
    profile,
    listings,
    isFollowing,
    currentUserId,
    handleFollow
  };
};
