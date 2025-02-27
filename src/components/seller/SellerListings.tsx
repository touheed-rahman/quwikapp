
import ProductCard from "@/components/ProductCard";
import { ProductCondition } from "@/types/categories";
import { supabase } from "@/integrations/supabase/client";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  created_at: string;
  condition: ProductCondition;
  featured: boolean;
}

interface SellerListingsProps {
  listings: Listing[];
}

const SellerListings = ({ listings }: SellerListingsProps) => {
  const getFirstImageUrl = (images: string[]) => {
    if (!images || images.length === 0) return "/placeholder.svg";
    return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
        Listings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
  );
};

export default SellerListings;
