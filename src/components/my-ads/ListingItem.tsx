
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckSquare, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ListingItemProps } from "./types";
import { getFirstImageUrl, handleDelete } from "./utils/listingUtils";
import ListingStats from "./ListingStats";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const ListingItem = ({ listing, onMarkAsSold, showSoldButton, onListingDeleted }: ListingItemProps) => {
  const { toast } = useToast();
  const isSold = listing.status === 'sold';
  // Extract just the area name before any special characters
  const cityName = listing.location?.split(/[|,]/)[0].trim() || 'Location not specified';

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

  const CardContent = () => (
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
            <h3 className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
            <p className="text-base font-bold text-primary mt-0.5">
              ₹{listing.price.toLocaleString()}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground">
                {cityName}
              </p>
              <Badge variant="secondary" className="text-xs">
                {listing.condition}
              </Badge>
              {listing.category === 'vehicles' && listing.km_driven !== null && (
                <Badge variant="outline" className="text-xs">
                  {listing.km_driven.toLocaleString()} km
                </Badge>
              )}
              {listing.status === 'rejected' && (
                <Badge variant="destructive" className="text-xs">
                  Rejected
                </Badge>
              )}
              {isSold && (
                <Badge variant="secondary" className="text-xs bg-gray-500 text-white">
                  Sold
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
            {showSoldButton && onMarkAsSold && !isSold && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMarkAsSold(listing.id);
                }}
                className="h-7 text-xs"
              >
                <CheckSquare className="w-3.5 h-3.5 mr-1" />
                Mark as Sold
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={cn(
      "relative overflow-hidden group",
      isSold && "opacity-75 pointer-events-none"
    )}>
      <div className="absolute top-2 right-2 z-10">
        {!isSold && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.preventDefault()}>
              <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isSold ? (
        <div className="cursor-not-allowed">
          <CardContent />
        </div>
      ) : (
        <Link to={`/product/${listing.id}`} className="block">
          <CardContent />
        </Link>
      )}
    </Card>
  );
};

export default ListingItem;
