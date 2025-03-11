
import { Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import RecentListings from "@/components/listings/RecentListings";
import { Listing } from "@/hooks/useListings";

interface RecentSectionProps {
  listings: Listing[];
  isLoading: boolean;
  error: Error | null;
  showAllProducts: boolean;
  setShowAllProducts: (show: boolean) => void;
  getFirstImageUrl: (images: string[]) => string;
  itemsPerPage: number;
  selectedLocation: string | null;
}

const RecentSection = ({
  listings,
  isLoading,
  error,
  showAllProducts,
  setShowAllProducts,
  getFirstImageUrl,
  itemsPerPage,
  selectedLocation
}: RecentSectionProps) => {
  const nonFeaturedListings = listings.filter(listing => !listing.featured);

  return (
    <motion.div 
      className="space-y-4"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-primary/10 p-1.5 rounded-full">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground/90">Recent Listings</h2>
      </div>
      
      {selectedLocation && (
        <motion.div 
          className="inline-flex items-center gap-2 bg-muted rounded-full px-3 py-1.5 text-sm mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium">{selectedLocation.split('|')[0]}</span>
        </motion.div>
      )}
      
      <RecentListings 
        listings={nonFeaturedListings}
        isLoading={isLoading}
        error={error}
        showAllProducts={showAllProducts}
        setShowAllProducts={setShowAllProducts}
        getFirstImageUrl={getFirstImageUrl}
        itemsPerPage={itemsPerPage}
      />
    </motion.div>
  );
};

export default RecentSection;
