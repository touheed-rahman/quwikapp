
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ProductCondition } from "@/types/categories";

const Wishlist = () => {
  const { toast } = useToast();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['wishlist-listings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: wishlistItems, error: wishlistError } = await supabase
        .from('wishlists')
        .select(`
          listing_id,
          listings (*)
        `)
        .eq('user_id', user.id);

      if (wishlistError) throw wishlistError;

      return wishlistItems
        .map(item => item.listings)
        .filter(Boolean)
        .map(listing => ({
          ...listing,
          condition: listing.condition as ProductCondition
        }));
    }
  });

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "https://via.placeholder.com/300";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Your wishlist is empty
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <ProductCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                location={listing.location || "Location not specified"}
                image={getFirstImageUrl(listing.images)}
                condition={listing.condition}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
