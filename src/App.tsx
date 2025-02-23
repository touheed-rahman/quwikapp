import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CategorySubcategories from "./pages/CategorySubcategories";

const ITEMS_PER_PAGE = 20;
const FEATURED_ITEMS_LIMIT = 6;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/category/:categoryId" element={<CategorySubcategories />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

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
          
          {featuredListings.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Featured Listings</h2>
                <Link 
                  to="/featured-listings" 
                  className="text-primary flex items-center hover:underline text-sm font-medium"
                >
                  View All Featured
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {featuredListings.map((listing) => (
                  <ProductCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    price={listing.price}
                    location={listing.location || "Location not specified"}
                    image={getFirstImageUrl(listing.images)}
                    date={new Date(listing.created_at).toLocaleDateString()}
                    condition={listing.condition}
                    featured={listing.featured}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recent Listings</h2>
            <RecentListings 
              listings={listings.filter(listing => !listing.featured)}
              isLoading={isLoading}
              error={error as Error}
              showAllProducts={showAllProducts}
              setShowAllProducts={setShowAllProducts}
              getFirstImageUrl={getFirstImageUrl}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </div>

        <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
        <FloatingSellButton />
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
};

export default App;
