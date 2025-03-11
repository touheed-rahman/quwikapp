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
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import { Listing } from "@/hooks/useListings";
import FAQSchema from "@/components/seo/FAQSchema";

const ITEMS_PER_PAGE = 20;
const FEATURED_ITEMS_LIMIT = 4;

const Index = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [randomFeaturedListings, setRandomFeaturedListings] = useState<Listing[]>([]);
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

  const faqData = [
    {
      question: "How do I buy an item on Quwik?",
      answer: "Browse through our listings, find an item you like, and click on it to view details. You can contact the seller directly via our chat system to arrange pickup and payment."
    },
    {
      question: "How do I sell my items on Quwik?",
      answer: "Click the 'Sell' button, create an account if you don't have one, then fill out the listing form with details about your item, add photos, set a price, and publish."
    },
    {
      question: "Is Quwik free to use?",
      answer: "Yes, basic buying and selling on Quwik is completely free. Premium features like promoting listings are available for a small fee."
    },
    {
      question: "How does payment work?",
      answer: "Quwik primarily facilitates direct transactions between buyers and sellers. Most transactions are handled in person with cash, but we also support electronic payments for convenience."
    },
    {
      question: "Is it safe to buy and sell on Quwik?",
      answer: "We implement various safety features to protect our users, including user verification, secure messaging, and community ratings. We also provide safety tips for meeting and conducting transactions."
    }
  ];

  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Quwik - Buy & Sell Locally",
    "description": "Discover the best local deals on Quwik. Buy and sell items locally - mobiles, electronics, cars, bikes, furniture and more.",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", ".featured-text"]
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": randomFeaturedListings.map((listing, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${window.location.origin}/product/${listing.id}`,
        "name": listing.title,
        "image": getFirstImageUrl(listing.images)
      }))
    }
  };

  const getLocationDetails = () => {
    if (!selectedLocation) return null;
    
    const parts = selectedLocation.split('|');
    return {
      locality: parts[0] || "Mumbai",
      region: parts[1] || "Maharashtra",
      country: "India"
    };
  };

  const locationDetails = getLocationDetails();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <SeoHead
        structuredData={homepageStructuredData}
        canonical={window.location.origin}
      />
      
      {locationDetails && (
        <LocalBusinessSchema
          address={{
            locality: locationDetails.locality,
            region: locationDetails.region,
            country: "IN"
          }}
        />
      )}
      
      <FAQSchema faqs={faqData} />
      
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

        <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
        <FloatingSellButton />
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
};

export default Index;
