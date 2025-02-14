
import { supabase } from "@/integrations/supabase/client";
import { ProductCondition } from "@/types/categories";
import ProductCard from "../ProductCard";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  created_at: string;
  condition: ProductCondition;
}

interface FeaturedListingsProps {
  listings: Listing[];
  getFirstImageUrl: (images: string[]) => string;
}

const FeaturedListings = ({ listings, getFirstImageUrl }: FeaturedListingsProps) => {
  const featuredListings = listings.slice(0, 4);

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Featured Listings</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {featuredListings.map((listing) => (
          <ProductCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            location={listing.location || "Location not specified"}
            image={getFirstImageUrl(listing.images)}
            date={new Date(listing.created_at).toLocaleDateString()}
            featured={true}
            condition={listing.condition as ProductCondition}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedListings;
