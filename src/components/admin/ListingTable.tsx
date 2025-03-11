
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
import { Eye, Star, StarOff, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ListingTableProps {
  listings: Listing[];
  onStatusUpdate: (listingId: string, status: string) => Promise<void>;
  onFeaturedToggle: (listingId: string, featured: boolean) => Promise<void>;
  onDelete: (listingId: string) => Promise<void>;
}

const ListingTable = ({ listings, onStatusUpdate, onFeaturedToggle, onDelete }: ListingTableProps) => {
  const { toast } = useToast();
  
  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'rejected':
        return <XCircle className="h-3 w-3 mr-1" />;
      case 'pending':
        return <Clock className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="rounded-md border shadow-sm bg-white overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-medium">Image</TableHead>
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">Category</TableHead>
              <TableHead className="font-medium">Price</TableHead>
              <TableHead className="font-medium">Seller</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Featured</TableHead>
              <TableHead className="text-right font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {listings.map((listing, index) => (
                <motion.tr 
                  key={listing.id} 
                  className="group hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                >
                  <TableCell>
                    <img 
                      src={getFirstImageUrl(listing.images)} 
                      alt={listing.title}
                      className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity shadow-sm border border-gray-100"
                      onClick={() => {
                        toast({
                          title: "Image Preview",
                          description: (
                            <div className="mt-2">
                              <img
                                src={getFirstImageUrl(listing.images)}
                                alt={listing.title}
                                className="w-full max-w-md rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />
                            </div>
                          ),
                        });
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
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
                      <span className="font-medium">{listing.seller?.full_name || 'Unknown'}</span>
                      <span className="text-xs text-muted-foreground">{listing.seller?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(listing.status)} flex items-center w-fit`}>
                      {getStatusIcon(listing.status)}
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="transition-opacity"
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
                        <Button variant="outline" size="sm" className="hover:bg-primary/5">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <ListingActions
                        listingId={listing.id}
                        onStatusUpdate={onStatusUpdate}
                        onDelete={onDelete}
                      />
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ListingTable;
