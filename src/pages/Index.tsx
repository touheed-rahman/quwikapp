import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ChatWindow from "@/components/chat/ChatWindow";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import FloatingSellButton from "@/components/navigation/FloatingSellButton";
import WelcomeDialog from "@/components/dialogs/WelcomeDialog";
import { useLocation as useReactRouterLocation } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { useListings } from "@/hooks/useListings";
import { motion, AnimatePresence } from "framer-motion";
import SeoHead from "@/components/seo/SeoHead";
import { Listing } from "@/hooks/useListings";
import ServiceView from "@/components/services/ServiceView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassifiedView from "@/components/views/ClassifiedView";
import { useSession } from "@/hooks/use-session-user";
import ServiceCenterAuth from "@/services/ServiceCenterAuth";

const FEATURED_ITEMS_LIMIT = 4;

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [randomFeaturedListings, setRandomFeaturedListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "classified";
  });
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [splashText, setSplashText] = useState("");
  const { selectedLocation } = useLocation();
  const reactLocation = useReactRouterLocation();
  const { user, session, loading } = useSession();
  const [isServiceProvider, setIsServiceProvider] = useState(false);
  
  const { data: listings = [], isLoading, error } = useListings({
    selectedLocation
  });

  useEffect(() => {
    const checkServiceProvider = async () => {
      if (session) {
        try {
          const isProvider = await ServiceCenterAuth.isServiceProvider();
          setIsServiceProvider(isProvider);
        } catch (error) {
          console.error("Error checking service provider status:", error);
        }
      }
    };
    
    checkServiceProvider();
    
    if (listings.length > 0) {
      const featuredItems = listings.filter(listing => listing.featured);
      const shuffled = [...featuredItems].sort(() => 0.5 - Math.random());
      setRandomFeaturedListings(shuffled.slice(0, FEATURED_ITEMS_LIMIT));
    } else {
      setRandomFeaturedListings([]);
    }
  }, [listings, session]);

  const handleTabChange = (value: string) => {
    localStorage.setItem("activeTab", value);
    
    setIsTabChanging(true);
    setSplashText(value === "classified" ? "Quwik Classified" : "Service Now");
    
    setTimeout(() => {
      setActiveTab(value);
      setIsTabChanging(false);
    }, 1000);
  };

  const showBottomNav = activeTab === "classified";

  if (!loading && isServiceProvider) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <SeoHead />
      <WelcomeDialog 
        open={showWelcomePopup} 
        onOpenChange={setShowWelcomePopup} 
      />

      <Header />

      <main className="container mx-auto px-4 pt-24 pb-24">
        <Tabs 
          defaultValue="classified" 
          className="w-full"
          onValueChange={handleTabChange}
          value={activeTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8 p-1.5 rounded-full bg-muted/80 backdrop-blur-sm border border-primary/10 shadow-sm shadow-primary/5">
            <TabsTrigger 
              value="classified" 
              className="rounded-full py-3.5 px-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-semibold relative overflow-hidden"
              disabled={isTabChanging}
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
              disabled={isTabChanging}
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
          
          <AnimatePresence>
            {isTabChanging && (
              <motion.div
                className="fixed inset-0 bg-primary/95 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.h1 
                    className="text-4xl md:text-6xl font-bold text-white"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                  >
                    {splashText}
                  </motion.h1>
                  <motion.div 
                    className="mt-4 flex justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-16 h-1 bg-white rounded-full" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "classified" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "classified" ? 20 : -20 }}
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
            </AnimatePresence>
          </div>
        </Tabs>

        {showBottomNav && (
          <>
            <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
            <FloatingSellButton />
          </>
        )}
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
};

export default Index;
