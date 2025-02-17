
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCondition } from "@/types/categories";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import HeroSearch from "@/components/HeroSearch";
import ChatWindow from "@/components/chat/ChatWindow";
import FeaturedListings from "@/components/listings/FeaturedListings";
import RecentListings from "@/components/listings/RecentListings";
import CategoryListings from "@/components/listings/CategoryListings";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import FloatingSellButton from "@/components/navigation/FloatingSellButton";
import WelcomeDialog from "@/components/dialogs/WelcomeDialog";
import { useListings } from "@/hooks/useListings";
import { useLocation } from "@/contexts/LocationContext";

const ITEMS_PER_PAGE = 20;

const Index = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const { selectedLocation } = useLocation();
  
  const { data: listings = [], isLoading, error, refetch } = useListings({
    categoryFilter: null,
    subcategoryFilter: null,
    selectedLocation,
    featured: false // Set to false to get all listings
  });

  // Subscribe to real-time updates for listings
  useEffect(() => {
    const channel = supabase
      .channel('public:listings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings'
        },
        () => {
          console.log('Listings updated, refreshing data');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
  };

  return (
    <div className="min-h-screen bg-background">
      <WelcomeDialog 
        open={showWelcomePopup} 
        onOpenChange={setShowWelcomePopup} 
      />

      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <HeroSearch />
          </div>
          
          <CategoryFilter />
          
          <FeaturedListings 
            listings={listings.filter(listing => listing.featured)}
            getFirstImageUrl={getFirstImageUrl}
          />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Fresh Recommendations</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 aspect-[4/3] rounded-lg" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Error loading recommendations
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No listings available in your area yet
              </div>
            ) : (
              <RecentListings 
                listings={listings}
                isLoading={isLoading}
                error={error as Error}
                showAllProducts={showAllProducts}
                setShowAllProducts={setShowAllProducts}
                getFirstImageUrl={getFirstImageUrl}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            )}
          </div>

          <CategoryListings 
            listings={listings}
            getFirstImageUrl={getFirstImageUrl}
          />
        </div>

        <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
        <FloatingSellButton />
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
};

export default Index;
