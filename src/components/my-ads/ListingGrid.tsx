
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProductCondition } from "@/types/categories";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, CheckSquare, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string | null;
  images: string[];
  condition: ProductCondition;
  status: string;
  view_count: number;
  save_count: number;
}

interface ListingGridProps {
  listings: Listing[];
  onMarkAsSold?: (id: string) => void;
  showSoldButton?: boolean;
  onListingDeleted?: () => void;
}

const ListingGrid = ({ listings, onMarkAsSold, showSoldButton, onListingDeleted }: ListingGridProps) => {
  const { toast } = useToast();

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "https://via.placeholder.com/300";
  };

  const handleDelete = async (listingId: string) => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('listings')
        .update({ 
          deleted_at: now,
          status: 'deleted'
        })
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });

      if (onListingDeleted) {
        onListingDeleted();
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    }
  };

  // Subscribe to real-time updates for view and save counts
  useEffect(() => {
    const channel = supabase
      .channel('listing-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings',
          filter: `id=in.(${listings.map(l => `'${l.id}'`).join(',')})`,
        },
        (payload) => {
          console.log('Received real-time update:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listings]);

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <Card 
          key={listing.id} 
          className="relative overflow-hidden"
        >
          <div className="flex gap-4 p-3">
            {/* Left side - Image */}
            <div className="w-24 h-20 flex-shrink-0">
              <img
                src={getFirstImageUrl(listing.images)}
                alt={listing.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
            
            {/* Right side - Content */}
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
                  
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {listing.view_count || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      {listing.save_count || 0} saves
                    </span>
                  </div>
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your listing.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(listing.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
