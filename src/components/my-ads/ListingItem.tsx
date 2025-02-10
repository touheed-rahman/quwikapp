
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckSquare, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ListingItemProps } from "./types";
import { getFirstImageUrl, handleDelete } from "./utils/listingUtils";
import ListingStats from "./ListingStats";
import DeleteDialog from "./DeleteDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

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

  const handleFeatureRequest = async () => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ featured_requested: true })
        .eq('id', listing.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feature request submitted successfully",
      });
    } catch (error) {
      console.error('Error requesting feature:', error);
      toast({
        title: "Error",
        description: "Failed to submit feature request",
        variant: "destructive",
      });
    }
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
                {listing.featured && (
                  <Badge variant="secondary" className="text-xs bg-yellow-500 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              
              <ListingStats 
                viewCount={listing.view_count} 
                saveCount={listing.save_count} 
              />
            </div>
            
            <div className="flex gap-2 mt-2">
              {showSoldButton && onMarkAsSold && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMarkAsSold(listing.id)}
                  className="h-7 text-xs"
                >
                  <CheckSquare className="w-3.5 h-3.5 mr-1" />
                  Mark as Sold
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!listing.featured && !listing.featured_requested && (
                    <DropdownMenuItem onClick={handleFeatureRequest}>
                      Request Featured
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ListingItem;
