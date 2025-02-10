
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ListingActions from "./ListingActions";
import { type Listing } from "./types";
import { supabase } from "@/integrations/supabase/client";

interface ListingTableProps {
  listings: Listing[];
  onStatusUpdate: (listingId: string, status: string) => Promise<void>;
  onFeaturedToggle: (listingId: string, featured: boolean) => Promise<void>;
}

const ListingTable = ({ listings, onStatusUpdate, onFeaturedToggle }: ListingTableProps) => {
  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "https://via.placeholder.com/300";
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
            <TableRow key={listing.id}>
              <TableCell>
                <img 
                  src={getFirstImageUrl(listing.images)} 
                  alt={listing.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell className="font-medium">{listing.title}</TableCell>
              <TableCell>{listing.category}</TableCell>
              <TableCell>₹{listing.price.toLocaleString()}</TableCell>
              <TableCell>{listing.seller?.full_name || 'Unknown'}</TableCell>
              <TableCell>
                <Badge
                  variant={listing.status === 'approved' ? 'default' : listing.status === 'rejected' ? 'destructive' : 'secondary'}
                >
                  {listing.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={listing.featured ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => onFeaturedToggle(listing.id, !listing.featured)}
                >
                  {listing.featured ? 'Featured' : 'Regular'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <ListingActions
                  listingId={listing.id}
                  onStatusUpdate={onStatusUpdate}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListingTable;
