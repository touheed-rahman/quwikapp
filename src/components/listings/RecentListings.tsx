
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight } from "lucide-react";
import { ProductCondition } from "@/types/categories";
import ProductCard from "../ProductCard";
import { Link } from "react-router-dom";

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

  if (listings.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Fresh Recommendations</h2>
        <Link 
          to="/fresh-recommendations" 
          className="text-primary flex items-center hover:underline"
        >
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 aspect-[4/3] rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          Error loading listings
        </div>
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
