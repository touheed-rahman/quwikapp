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
import { UserCheck, UserPlus, MapPin, Calendar } from "lucide-react";
import SeoHead from "@/components/seo/SeoHead";
import { ProductCondition } from "@/types/categories";
import { useIsMobile } from "@/hooks/use-mobile";

const SellerProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();

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

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
          <div className="h-4 bg-gray-200 rounded w-[150px]"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoHead
        title={`${profile.full_name}'s Profile | Quwik Marketplace`}
        description={`Check out ${profile.full_name}'s listings and profile on Quwik. Member since ${new Date(profile.created_at).getFullYear()}`}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="p-6 mb-8 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-2 ring-primary/10">
                <AvatarFallback className="text-3xl md:text-4xl bg-primary/5">
                  {profile.full_name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left space-y-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {profile.full_name}
                </h1>
                
                <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-muted-foreground">
                  <div className="flex items-center justify-center md:justify-start gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Member since {new Date(profile.created_at).getFullYear()}
                    </span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center justify-center md:justify-start gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center md:justify-start gap-6 pt-2">
                  <span className="text-sm">
                    <strong className="text-foreground">{profile.followers_count || 0}</strong>
                    <span className="text-muted-foreground ml-1">followers</span>
                  </span>
                  <span className="text-sm">
                    <strong className="text-foreground">{profile.following_count || 0}</strong>
                    <span className="text-muted-foreground ml-1">following</span>
                  </span>
                </div>
              </div>
            </div>
            
            {currentUserId !== id && (
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                className="w-full md:w-auto"
                size={isMobile ? "lg" : "default"}
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

        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
            Listings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <ProductCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                location={listing.location}
                image={getFirstImageUrl(listing.images)}
                date={new Date(listing.created_at).toLocaleDateString()}
                condition={listing.condition as ProductCondition}
                featured={listing.featured}
              />
            ))}
          </div>
          
          {listings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No listings yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This seller hasn't posted any items for sale
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerProfile;
