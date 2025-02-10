
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { ProductCondition } from "@/types/categories";
import { supabase } from "@/integrations/supabase/client";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string | null;
  images: string[];
  condition: ProductCondition;
  status: string;
}

interface ListingGridProps {
  listings: Listing[];
  onMarkAsSold?: (id: string) => void;
  showSoldButton?: boolean;
}

const ListingGrid = ({ listings, onMarkAsSold, showSoldButton }: ListingGridProps) => {
  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "https://via.placeholder.com/300";
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {listings.map((listing) => (
        <div key={listing.id} className="relative">
          <ProductCard
            id={listing.id}
            title={listing.title}
            price={listing.price}
            location={listing.location || "Location not specified"}
            image={getFirstImageUrl(listing.images)}
            condition={listing.condition}
          />
          {listing.status === 'rejected' && (
            <Badge 
              variant="destructive"
              className="absolute top-2 right-2"
            >
              Rejected
            </Badge>
          )}
          {showSoldButton && onMarkAsSold && (
            <Button
              className="absolute bottom-2 right-2 bg-primary"
              size="sm"
              onClick={() => onMarkAsSold(listing.id)}
            >
              Mark as Sold
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListingGrid;
