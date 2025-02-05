import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ListingActions from "./ListingActions";
import { type Listing } from "./types";

interface ListingTableProps {
  listings: Listing[];
  onStatusUpdate: (listingId: string, status: string) => Promise<void>;
}

const ListingTable = ({ listings, onStatusUpdate }: ListingTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell className="font-medium">{listing.title}</TableCell>
              <TableCell>{listing.category}</TableCell>
              <TableCell>₹{listing.price.toLocaleString()}</TableCell>
              <TableCell>{listing.seller?.full_name || 'Unknown'}</TableCell>
              <TableCell>{listing.status}</TableCell>
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