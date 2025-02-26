
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";
import { UserCheck, UserPlus } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";

const SellerProfile = () => {
  const { id } = useParams();
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

  const getFirstImageUrl = (images: string[]) => {
    if (!images || images.length === 0) return "/placeholder.svg";
    return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoHead
        title={`${profile.full_name}'s Profile | Quwik Marketplace`}
        description={`Check out ${profile.full_name}'s listings and profile on Quwik. Member since ${new Date(profile.created_at).getFullYear()}`}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {profile.full_name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                <p className="text-muted-foreground">
                  Member since {new Date(profile.created_at).getFullYear()}
                </p>
                <div className="flex gap-4 mt-2">
                  <span className="text-sm">
                    <strong>{profile.followers_count || 0}</strong> followers
                  </span>
                  <span className="text-sm">
                    <strong>{profile.following_count || 0}</strong> following
                  </span>
                </div>
              </div>
            </div>
            
            {currentUserId !== id && (
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                className="ml-4"
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <ProductCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                location={listing.location}
                image={getFirstImageUrl(listing.images)}
                date={new Date(listing.created_at).toLocaleDateString()}
                condition={listing.condition}
                featured={listing.featured}
              />
            ))}
          </div>
          
          {listings.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No listings yet
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerProfile;
