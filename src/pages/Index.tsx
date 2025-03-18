
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ChatWindow from "@/components/chat/ChatWindow";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import FloatingSellButton from "@/components/navigation/FloatingSellButton";
import WelcomeDialog from "@/components/dialogs/WelcomeDialog";
import { useLocation } from "@/contexts/LocationContext";
import { useListings } from "@/hooks/useListings";
import { motion } from "framer-motion";
import SeoHead from "@/components/seo/SeoHead";
import { Listing } from "@/hooks/useListings";
import ServiceView from "@/components/services/ServiceView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassifiedView from "@/components/views/ClassifiedView";

const FEATURED_ITEMS_LIMIT = 4;

const Index = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <SeoHead />
      <WelcomeDialog 
        open={showWelcomePopup} 
        onOpenChange={setShowWelcomePopup} 
      />

      <Header />

      <main className="container mx-auto px-4 pt-32 pb-24"> {/* Increased top padding for better spacing */}
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
              <ClassifiedView 
                listings={listings}
                isLoading={isLoading}
                error={error as Error}
                selectedLocation={selectedLocation}
                featuredListings={randomFeaturedListings}
              />
            </TabsContent>
            
            <TabsContent value="services" className="mt-0">
              <ServiceView />
            </TabsContent>
          </motion.div>
        </Tabs>

        {activeTab === "classified" && (
          <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
        )}
        {activeTab === "classified" && (
          <FloatingSellButton />
        )}
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
};

export default Index;
