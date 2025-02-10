
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductCondition } from "@/types/categories";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="grid gap-4">
      {listings.map((listing) => (
        <Card 
          key={listing.id} 
          className="relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-48 h-48">
              <img
                src={getFirstImageUrl(listing.images)}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 p-4">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <Link to={`/product/${listing.id}`}>
                    <h3 className="text-lg font-semibold line-clamp-2 hover:text-primary transition-colors">
                      {listing.title}
                    </h3>
                  </Link>
                  <p className="text-xl font-bold text-primary mt-1">
                    ₹{listing.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {listing.location || "Location not specified"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge>
                      {listing.condition}
                    </Badge>
                    {listing.status === 'rejected' && (
                      <Badge variant="destructive">
                        Rejected
                      </Badge>
                    )}
                  </div>
                </div>
                
                {showSoldButton && onMarkAsSold && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkAsSold(listing.id)}
                      className="flex items-center gap-2"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Mark as Sold</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ListingGrid;
