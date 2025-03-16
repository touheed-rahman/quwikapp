
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, MapPin } from "lucide-react";
import { ProductCondition } from "@/types/categories";
import ProductCard from "../ProductCard";
import { Link } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";

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
  const { selectedLocation } = useLocation();
  const displayedListings = showAllProducts
    ? listings
    : listings.slice(0, itemsPerPage);

  const cityName = selectedLocation ? selectedLocation.split('|')[0] : null;

  console.log('Current listings:', listings);
  console.log('Selected location:', selectedLocation);
  console.log('City name:', cityName);

  return (
    <section className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="bg-gray-200 aspect-[4/3] rounded-lg animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 font-medium mb-2">Error loading listings</div>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-lg font-medium">No listings found</div>
          {cityName ? (
            <>
              <p className="text-sm text-muted-foreground">
                There are no listings available in {cityName} yet. Be the first to post!
              </p>
              <Link to="/sell">
                <Button className="mt-4" variant="default">
                  Post Your First Listing
                </Button>
              </Link>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Please select a location to see listings in your area
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            {!showAllProducts && listings.length > itemsPerPage && (
              <Button
                onClick={() => setShowAllProducts(true)}
                variant="outline"
                className="gap-2"
              >
                Load More
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
            
            <Link 
              to="/fresh-recommendations" 
              className="text-primary flex items-center hover:underline text-sm font-medium"
            >
              View All Recommendations
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecentListings;
