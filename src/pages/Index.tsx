import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ['listings', selectedCategory, selectedSubcategory],
    queryFn: async () => {
      console.log('Fetching listings with filters:', { selectedCategory, selectedSubcategory });
      
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved');

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      
      if (selectedSubcategory) {
        query = query.eq('subcategory', selectedSubcategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }

      console.log('Fetched listings:', data);
      return data as Listing[];
    }
  });

  const handleCategorySelect = (category: string, subcategory: string) => {
    console.log('Category selected:', { category, subcategory });
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  };

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
          <CategoryFilter onSelectCategory={handleCategorySelect} />
          
          <FeaturedListings 
            listings={listings}
            getFirstImageUrl={getFirstImageUrl}
          />

          <RecentListings 
            listings={listings}
            isLoading={isLoading}
            error={error as Error}
            showAllProducts={showAllProducts}
            setShowAllProducts={setShowAllProducts}
            getFirstImageUrl={getFirstImageUrl}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          <CategoryListings 
            listings={listings}
            getFirstImageUrl={getFirstImageUrl}
          />
        </div>

        <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />

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