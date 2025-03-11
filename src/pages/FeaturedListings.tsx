
import Header from "@/components/Header";
import { useListings } from "@/hooks/useListings";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import { useLocation } from "@/contexts/LocationContext";
import { Loader2 } from "lucide-react";

const FeaturedListings = () => {
  const { selectedLocation } = useLocation();
  const { data: listings = [], isLoading } = useListings({ selectedLocation });

  const featuredListings = listings.filter(listing => listing.featured);

  const getFirstImageUrl = (images: string[]) => {
    if (!images || images.length === 0) return "/placeholder.svg";
    return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <h1 className="text-2xl font-bold mb-6">Featured Listings</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : featuredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured listings available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredListings.map((listing) => (
              <ProductCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                location={listing.location || "Location not specified"}
                image={getFirstImageUrl(listing.images)}
                date={new Date(listing.created_at).toLocaleDateString()}
                condition={listing.condition}
                featured={listing.featured}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FeaturedListings;
