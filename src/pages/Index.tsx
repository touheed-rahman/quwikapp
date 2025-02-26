
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroSearch from "@/components/HeroSearch";
import FeaturedListings from "@/components/listings/FeaturedListings";
import CategoryListings from "@/components/listings/CategoryListings";
import RecentListings from "@/components/listings/RecentListings";
import SeoHead from "@/components/seo/SeoHead";
import { useListings } from "@/hooks/useListings";
import { useLocation } from "@/contexts/LocationContext";

const Index = () => {
  const { selectedLocation } = useLocation();
  const { data: listings = [], isLoading, error } = useListings({
    selectedLocation,
  });
  const [showAllProducts, setShowAllProducts] = useState(false);
  const itemsPerPage = 12;

  const getFirstImageUrl = (images: string[]) => {
    if (!images || images.length === 0) return "/placeholder.svg";
    return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
  };

  useEffect(() => {
    // Preload important images for performance
    const images = ['/og-image.png'];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <>
      <SeoHead 
        title="Quwik - Your Local Marketplace for Buying and Selling | Best Deals Near You"
        description="Discover amazing local deals on Quwik! Buy and sell mobiles, cars, bikes, electronics, furniture and more. Safe, secure and trusted marketplace with verified sellers. Find the best deals near you today."
        keywords={[
          "local marketplace",
          "buy and sell online",
          "used items for sale",
          "second hand products",
          "mobile phones",
          "used cars",
          "used bikes",
          "electronics",
          "furniture",
          "home appliances",
          "real estate",
          "jobs",
          "services",
          "local classifieds",
          "verified sellers",
          "safe trading",
          "secure marketplace",
          "best deals",
          "nearby sellers",
          "local shopping"
        ]}
        type="website"
      />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <HeroSearch />
        <FeaturedListings 
          listings={listings}
          getFirstImageUrl={getFirstImageUrl}
        />
        <CategoryListings 
          listings={listings}
          getFirstImageUrl={getFirstImageUrl}
        />
        <RecentListings 
          listings={listings}
          isLoading={isLoading}
          error={error}
          showAllProducts={showAllProducts}
          setShowAllProducts={setShowAllProducts}
          getFirstImageUrl={getFirstImageUrl}
          itemsPerPage={itemsPerPage}
        />
      </main>
    </>
  );
};

export default Index;
