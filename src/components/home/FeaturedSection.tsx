
import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/hooks/useListings";

interface FeaturedSectionProps {
  listings: Listing[];
  featuredLimit: number;
}

const FeaturedSection = ({ listings, featuredLimit }: FeaturedSectionProps) => {
  const [randomFeaturedListings, setRandomFeaturedListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (listings.length > 0) {
      const featuredItems = listings.filter(listing => listing.featured);
      const shuffled = [...featuredItems].sort(() => 0.5 - Math.random());
      setRandomFeaturedListings(shuffled.slice(0, featuredLimit));
    } else {
      setRandomFeaturedListings([]);
    }
  }, [listings, featuredLimit]);

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
  };

  if (randomFeaturedListings.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="space-y-4"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
      }}
    >
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-full">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground/90">Featured Listings</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {randomFeaturedListings.map((listing, index) => (
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
  );
};

export default FeaturedSection;
