
import { useState } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import HeroSearch from "@/components/HeroSearch";
import ChatWindow from "@/components/chat/ChatWindow";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import FloatingSellButton from "@/components/navigation/FloatingSellButton";
import WelcomeDialog from "@/components/dialogs/WelcomeDialog";
import { useLocation } from "@/contexts/LocationContext";
import { useListings } from "@/hooks/useListings";
import RecentListings from "@/components/listings/RecentListings";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, MapPin, Clock } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 20;
const FEATURED_ITEMS_LIMIT = 6;

const Index = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const { selectedLocation } = useLocation();
  
  const { data: listings = [], isLoading, error } = useListings({
    selectedLocation
  });

  const featuredListings = listings
    .filter(listing => listing.featured)
    .slice(0, FEATURED_ITEMS_LIMIT);

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
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <WelcomeDialog 
        open={showWelcomePopup} 
        onOpenChange={setShowWelcomePopup} 
      />

      <Header />
      <main className="container mx-auto px-4 pt-16 pb-24">
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
          
          <motion.div
            variants={item}
          >
            <CategoryFilter />
          </motion.div>
          
          {featuredListings.length > 0 && (
            <motion.div 
              className="space-y-4"
              variants={item}
            >
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Featured Listings</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {featuredListings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
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
            <div className="flex items-center mb-4">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Recent Listings</h2>
            </div>
            
            {selectedLocation && (
              <motion.div 
                className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5 text-sm mb-4"
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
              error={error as Error}
              showAllProducts={showAllProducts}
              setShowAllProducts={setShowAllProducts}
              getFirstImageUrl={getFirstImageUrl}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </motion.div>
        </motion.div>

        <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
        <FloatingSellButton />
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
};

export default Index;
