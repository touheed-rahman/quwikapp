
import { useState } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Home, MessageSquare, ListOrdered, Heart } from "lucide-react";
import { categories, ProductCondition } from "@/types/categories";
import HeroSearch from "@/components/HeroSearch";
import { Link } from "react-router-dom";
import ChatWindow from "@/components/chat/ChatWindow";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 20;

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  created_at: string;
  condition: ProductCondition;
  category: string;
}

const Index = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as Listing[];
    }
  });

  // Filter featured listings (for now, we'll consider the first few listings as featured)
  const featuredListings = listings.slice(0, 4);
  
  const displayedListings = showAllProducts
    ? listings
    : listings.slice(0, ITEMS_PER_PAGE);

  // Get the URL for the first image in the array, or use a placeholder
  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"; // placeholder image
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="space-y-6">
          <HeroSearch />

          <CategoryFilter />
          
          {/* Featured Listings */}
          <section>
            <h2 className="text-xl font-bold mb-4">Featured Listings</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {featuredListings.map((listing) => (
                <ProductCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  location={listing.location || "Location not specified"}
                  image={getFirstImageUrl(listing.images)}
                  date={new Date(listing.created_at).toLocaleDateString()}
                  featured={true}
                  condition={listing.condition as ProductCondition}
                />
              ))}
            </div>
          </section>

          {/* Recent Listings */}
          <section>
            <h2 className="text-xl font-bold mb-4">Fresh Recommendations</h2>
            {isLoading ? (
              <div className="text-center py-8">Loading listings...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error loading listings</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {displayedListings.map((listing) => (
                  <ProductCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    price={listing.price}
                    location={listing.location || "Location not specified"}
                    image={getFirstImageUrl(listing.images)}
                    date={new Date(listing.created_at).toLocaleDateString()}
                    condition={listing.condition as ProductCondition}
                  />
                ))}
              </div>
            )}
            
            {!showAllProducts && listings.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setShowAllProducts(true)}
                  variant="outline"
                  className="gap-2"
                >
                  Load More
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </section>

          {/* Category-wise Listings */}
          {categories.map((category) => {
            const categoryListings = listings.filter(
              (listing) => listing.category === category.id
            ).slice(0, 4);

            return categoryListings.length > 0 ? (
              <section key={category.id}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{category.name}</h2>
                  <Button variant="ghost" className="text-primary">
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categoryListings.map((listing) => (
                    <ProductCard
                      key={listing.id}
                      id={listing.id}
                      title={listing.title}
                      price={listing.price}
                      location={listing.location || "Location not specified"}
                      image={getFirstImageUrl(listing.images)}
                      date={new Date(listing.created_at).toLocaleDateString()}
                      condition={listing.condition as ProductCondition}
                    />
                  ))}
                </div>
              </section>
            ) : null;
          })}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-between px-6 py-2 z-50">
          <Link to="/" className="flex flex-col items-center gap-1">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xs">Home</span>
          </Link>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="flex flex-col items-center gap-1"
          >
            <MessageSquare className="h-6 w-6 text-muted-foreground hover:text-white transition-colors" />
            <span className="text-xs hover:text-white transition-colors">Chats</span>
          </button>
          <Link
            to="/sell"
            className="flex flex-col items-center -mt-8"
          >
            <div className="bg-primary rounded-full p-4 shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1">Sell Now</span>
          </Link>
          <Link to="/my-ads" className="flex flex-col items-center gap-1">
            <ListOrdered className="h-6 w-6 text-muted-foreground hover:text-white transition-colors" />
            <span className="text-xs hover:text-white transition-colors">My Ads</span>
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center gap-1">
            <Heart className="h-6 w-6 text-muted-foreground hover:text-white transition-colors" />
            <span className="text-xs hover:text-white transition-colors">Wishlist</span>
          </Link>
        </div>

        {/* Desktop Sell Button */}
        <Link
          to="/sell"
          className="hidden md:block fixed bottom-6 right-6 z-50"
        >
          <Button size="lg" className="shadow-lg rounded-full px-8 gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-5 w-5" />
            Sell Now
          </Button>
        </Link>

        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
};

export default Index;
