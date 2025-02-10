
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import LocationSelector from "@/components/LocationSelector";
import { useToast } from "@/components/ui/use-toast";

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
  status: string;
  distance_km?: number;
}

const Index = () => {
  const [searchParams] = useSearchParams();
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const { toast } = useToast();
  
  const categoryFilter = searchParams.get('category');
  const subcategoryFilter = searchParams.get('subcategory');

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey: ['listings', categoryFilter, subcategoryFilter, selectedLocation],
    queryFn: async () => {
      console.log('Fetching listings with filters:', { categoryFilter, subcategoryFilter, selectedLocation });
      
      try {
        let query;
        if (selectedLocation) {
          // Parse location string to get place_id
          const locationParts = selectedLocation.split('|');
          const placeId = locationParts[locationParts.length - 1];
          
          // First get the location details from cache
          const { data: locationData } = await supabase
            .from('location_cache')
            .select('latitude, longitude')
            .eq('place_id', placeId)
            .single();

          if (locationData) {
            query = supabase.rpc('get_listings_by_location', {
              location_query: null,
              search_lat: locationData.latitude,
              search_long: locationData.longitude,
              radius_km: 20
            });
          } else {
            // Fallback to simple location query if coordinates not found
            query = supabase.rpc('get_listings_by_location', {
              location_query: placeId
            });
          }
        } else {
          // No location selected, get all listings
          query = supabase.rpc('get_listings_by_location', {
            location_query: null,
            search_lat: null,
            search_long: null
          });
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching listings:', error);
          throw error;
        }

        let filteredListings = data as Listing[];
        
        if (categoryFilter) {
          filteredListings = filteredListings.filter(listing => listing.category === categoryFilter);
        }

        console.log('Fetched listings:', filteredListings);
        return filteredListings;
      } catch (error) {
        console.error('Error in listing query:', error);
        toast({
          title: "Error",
          description: "Failed to fetch listings. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <HeroSearch />
            <LocationSelector 
              value={selectedLocation} 
              onChange={setSelectedLocation}
            />
          </div>
          <CategoryFilter />
          
          {!categoryFilter && (
            <FeaturedListings 
              listings={listings}
              getFirstImageUrl={getFirstImageUrl}
            />
          )}

          <RecentListings 
            listings={listings}
            isLoading={isLoading}
            error={error as Error}
            showAllProducts={showAllProducts}
            setShowAllProducts={setShowAllProducts}
            getFirstImageUrl={getFirstImageUrl}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          {!categoryFilter && (
            <CategoryListings 
              listings={listings}
              getFirstImageUrl={getFirstImageUrl}
            />
          )}
        </div>

        <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />

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
