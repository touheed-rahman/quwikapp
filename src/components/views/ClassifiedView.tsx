
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, MapPin, Clock } from "lucide-react";
import HeroSearch from "@/components/HeroSearch";
import CategoryFilter from "@/components/CategoryFilter";
import RecentListings from "@/components/listings/RecentListings";
import ProductCard from "@/components/ProductCard";
import { Listing } from "@/hooks/useListings";
import { supabase } from "@/integrations/supabase/client";

type ClassifiedViewProps = {
  listings: Listing[];
  isLoading: boolean;
  error: Error | null;
  selectedLocation: string | null;
  featuredListings: Listing[];
}

const ITEMS_PER_PAGE = 20;

const ClassifiedView = ({ listings, isLoading, error, selectedLocation, featuredListings }: ClassifiedViewProps) => {
  const [showAllProducts, setShowAllProducts] = useState(false);

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        variants={item}
        className="flex flex-col gap-4"
      >
        <HeroSearch />
      </motion.div>
      
      <motion.div variants={item}>
        <CategoryFilter />
      </motion.div>
      
      {featuredListings.length > 0 && (
        <motion.div 
          className="space-y-4"
          variants={item}
        >
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-full">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground/90">Featured Listings</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <ProductCard
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  location={listing.location || "Location not specified"}
                  image={getFirstImageUrl(listing.images)}
                  date={new Date(listing.created_at).toLocaleDateString()}
                  condition={listing.condition}
                  featured={listing.featured}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className="space-y-4"
        variants={item}
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
          listings={listings.filter(listing => !listing.featured)}
          isLoading={isLoading}
          error={error}
          showAllProducts={showAllProducts}
          setShowAllProducts={setShowAllProducts}
          getFirstImageUrl={getFirstImageUrl}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </motion.div>
    </motion.div>
  );
};

export default ClassifiedView;
