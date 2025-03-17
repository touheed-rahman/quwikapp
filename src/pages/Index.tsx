
import { useState, useEffect } from "react";
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
import SeoHead from "@/components/seo/SeoHead";
import { Listing } from "@/hooks/useListings";
import ServiceView from "@/components/services/ServiceView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ITEMS_PER_PAGE = 20;
const FEATURED_ITEMS_LIMIT = 4;

const Index = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [randomFeaturedListings, setRandomFeaturedListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState("classified");
  const { selectedLocation } = useLocation();
  
  const { data: listings = [], isLoading, error } = useListings({
    selectedLocation
  });

  useEffect(() => {
    if (listings.length > 0) {
      const featuredItems = listings.filter(listing => listing.featured);
      
      const shuffled = [...featuredItems].sort(() => 0.5 - Math.random());
      
      setRandomFeaturedListings(shuffled.slice(0, FEATURED_ITEMS_LIMIT));
    } else {
      setRandomFeaturedListings([]);
    }
  }, [listings]);

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

  const ClassifiedView = () => (
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
      
      {randomFeaturedListings.length > 0 && (
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
          error={error as Error}
          showAllProducts={showAllProducts}
          setShowAllProducts={setShowAllProducts}
          getFirstImageUrl={getFirstImageUrl}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <SeoHead />
      <WelcomeDialog 
        open={showWelcomePopup} 
        onOpenChange={setShowWelcomePopup} 
      />

      <Header />
      <main className="container mx-auto px-4 pt-16 pb-24">
        <Tabs 
          defaultValue="classified" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8 p-1.5 rounded-full bg-muted/80 backdrop-blur-sm border border-primary/10 shadow-sm shadow-primary/5">
            <TabsTrigger 
              value="classified" 
              className="rounded-full py-3.5 px-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-semibold relative overflow-hidden"
            >
              <span className="relative z-10">Quwik Classified</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 rounded-full"
                initial={{ x: "-100%" }}
                animate={{ x: activeTab === "classified" ? 0 : "-100%" }}
                transition={{ duration: 0.3 }}
              />
            </TabsTrigger>
            <TabsTrigger 
              value="services" 
              className="rounded-full py-3.5 px-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-semibold relative overflow-hidden"
            >
              <span className="relative z-10">Service Now</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 rounded-full"
                initial={{ x: "100%" }}
                animate={{ x: activeTab === "services" ? 0 : "100%" }}
                transition={{ duration: 0.3 }}
              />
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "classified" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <TabsContent value="classified" className="mt-0">
              <ClassifiedView />
            </TabsContent>
            
            <TabsContent value="services" className="mt-0">
              <ServiceView />
            </TabsContent>
          </motion.div>
        </Tabs>

        <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
        <FloatingSellButton />
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
};

export default Index;
