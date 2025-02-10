
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ListingActions from "./ListingActions";
import { type Listing } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Star, StarOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface ListingTableProps {
  listings: Listing[];
  onStatusUpdate: (listingId: string, status: string) => Promise<void>;
  onFeaturedToggle: (listingId: string, featured: boolean) => Promise<void>;
}

const ListingTable = ({ listings, onStatusUpdate, onFeaturedToggle }: ListingTableProps) => {
  const { toast } = useToast();
  
  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "https://via.placeholder.com/300";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id} className="group hover:bg-gray-50">
              <TableCell>
                <img 
                  src={getFirstImageUrl(listing.images)} 
                  alt={listing.title}
                  className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => {
                    toast({
                      title: "Image Preview",
                      description: (
                        <div className="mt-2">
                          <img
                            src={getFirstImageUrl(listing.images)}
                            alt={listing.title}
                            className="w-full max-w-md rounded-lg"
                          />
                        </div>
                      ),
                    });
                  }}
                />
              </TableCell>
              <TableCell className="font-medium max-w-[200px]">
                <div className="truncate" title={listing.title}>
                  {listing.title}
                </div>
              </TableCell>
              <TableCell>{listing.category}</TableCell>
              <TableCell>₹{listing.price.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{listing.seller?.full_name || 'Unknown'}</span>
                  <span className="text-xs text-muted-foreground">{listing.seller?.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(listing.status)}>
                  {listing.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:opacity-100 transition-opacity"
                  onClick={() => onFeaturedToggle(listing.id, !listing.featured)}
                >
                  {listing.featured ? (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link to={`/product/${listing.id}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <ListingActions
                    listingId={listing.id}
                    onStatusUpdate={onStatusUpdate}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListingTable;
