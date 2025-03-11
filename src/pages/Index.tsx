
import { useState, useEffect } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import HeroSearch from "@/components/HeroSearch";
import WelcomeDialog from "@/components/dialogs/WelcomeDialog";
import { useLocation } from "@/contexts/LocationContext";
import { useListings } from "@/hooks/useListings";
import { supabase } from "@/integrations/supabase/client";
import SeoHead from "@/components/seo/SeoHead";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import HomeLayout from "@/components/home/HomeLayout";
import FeaturedSection from "@/components/home/FeaturedSection";
import RecentSection from "@/components/home/RecentSection";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 20;
const FEATURED_ITEMS_LIMIT = 4;

const Index = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const { selectedLocation } = useLocation();
  
  const { data: listings = [], isLoading, error } = useListings({
    selectedLocation
  });

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
  };

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
      "itemListElement": listings
        .filter(listing => listing.featured)
        .slice(0, FEATURED_ITEMS_LIMIT)
        .map((listing, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `${window.location.origin}/product/${listing.id}`,
          "name": listing.title,
          "image": getFirstImageUrl(listing.images)
        }))
    }
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
    <HomeLayout>
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

      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
        }}
        className="flex flex-col gap-4"
      >
        <HeroSearch />
      </motion.div>
      
      <motion.div variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
      }}>
        <CategoryFilter />
      </motion.div>
      
      <FeaturedSection 
        listings={listings}
        featuredLimit={FEATURED_ITEMS_LIMIT}
      />
      
      <RecentSection 
        listings={listings}
        isLoading={isLoading}
        error={error as Error}
        showAllProducts={showAllProducts}
        setShowAllProducts={setShowAllProducts}
        getFirstImageUrl={getFirstImageUrl}
        itemsPerPage={ITEMS_PER_PAGE}
        selectedLocation={selectedLocation}
      />
    </HomeLayout>
  );
};

export default Index;
