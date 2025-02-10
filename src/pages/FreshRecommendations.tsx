
import { useListings } from "@/hooks/useListings";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FreshRecommendations = () => {
  const { data: listings = [], isLoading, error } = useListings({
    categoryFilter: null,
    subcategoryFilter: null,
    selectedLocation: null,
  });

  const getFirstImageUrl = (images: string[]) => {
    if (!images || images.length === 0) return "/placeholder.svg";
    return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-20 pb-24">
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-20 pb-24">
          <div className="text-center py-8">
            Error loading listings. Please try again.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <h1 className="text-2xl font-bold mb-6">Fresh Recommendations</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <ProductCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              price={listing.price}
              location={listing.location}
              image={getFirstImageUrl(listing.images)}
              condition={listing.condition}
              featured={listing.featured}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default FreshRecommendations;
