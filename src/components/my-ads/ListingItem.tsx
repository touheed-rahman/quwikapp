
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ListingItemProps } from "./types";
import { getFirstImageUrl, handleDelete } from "./utils/listingUtils";
import ListingStats from "./ListingStats";
import DeleteDialog from "./DeleteDialog";

const ListingItem = ({ listing, onMarkAsSold, showSoldButton, onListingDeleted }: ListingItemProps) => {
  const { toast } = useToast();

  const handleDeleteClick = async () => {
    await handleDelete(
      listing.id,
      () => {
        toast({
          title: "Success",
          description: "Listing deleted successfully",
        });
        if (onListingDeleted) {
          onListingDeleted();
        }
      },
      (error) => {
        console.error('Error deleting listing:', error);
        toast({
          title: "Error",
          description: "Failed to delete listing",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex gap-4 p-3">
        <div className="w-24 h-20 flex-shrink-0">
          <img
            src={getFirstImageUrl(listing.images)}
            alt={listing.title}
            className="w-full h-full object-cover rounded"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col h-full justify-between">
            <div>
              <Link to={`/product/${listing.id}`}>
                <h3 className="text-base font-semibold line-clamp-1 hover:text-primary transition-colors">
                  {listing.title}
                </h3>
              </Link>
              <p className="text-base font-bold text-primary mt-0.5">
                ₹{listing.price.toLocaleString()}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">
                  {listing.location || "Location not specified"}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {listing.condition}
                </Badge>
                {listing.status === 'rejected' && (
                  <Badge variant="destructive" className="text-xs">
                    Rejected
                  </Badge>
                )}
              </div>
              
              <ListingStats 
                viewCount={listing.view_count} 
                saveCount={listing.save_count} 
              />
            </div>
            
            {showSoldButton && onMarkAsSold && (
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMarkAsSold(listing.id)}
                  className="h-7 text-xs"
                >
                  <CheckSquare className="w-3.5 h-3.5 mr-1" />
                  Mark as Sold
                </Button>
                <DeleteDialog onDelete={handleDeleteClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ListingItem;
