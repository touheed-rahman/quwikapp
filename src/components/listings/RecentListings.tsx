
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
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

interface RecentListingsProps {
  listings: Listing[];
  isLoading: boolean;
  error: Error | null;
  showAllProducts: boolean;
  setShowAllProducts: (show: boolean) => void;
  getFirstImageUrl: (images: string[]) => string;
  itemsPerPage: number;
}

const RecentListings = ({
  listings,
  isLoading,
  error,
  showAllProducts,
  setShowAllProducts,
  getFirstImageUrl,
  itemsPerPage,
}: RecentListingsProps) => {
  const displayedListings = showAllProducts
    ? listings
    : listings.slice(0, itemsPerPage);

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Fresh Recommendations</h2>
      {isLoading ? (
        <div className="text-center py-8">Loading listings...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Error loading listings</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {displayedListings.map((listing) => (
            <ProductCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              price={listing.price}
              location={listing.location || "Location not specified"}
              image={getFirstImageUrl(listing.images)}
              date={new Date(listing.created_at).toLocaleDateString()}
              condition={listing.condition as ProductCondition}
            />
          ))}
        </div>
      )}
      
      {!showAllProducts && listings.length > itemsPerPage && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => setShowAllProducts(true)}
            variant="outline"
            className="gap-2"
          >
            Load More
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default RecentListings;
