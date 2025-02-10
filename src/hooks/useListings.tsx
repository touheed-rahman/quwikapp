
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCondition } from "@/types/categories";
import { useToast } from "@/components/ui/use-toast";

export interface Listing {
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
  featured: boolean;
}

interface UseListingsProps {
  categoryFilter: string | null;
  subcategoryFilter: string | null;
  selectedLocation: string | null;
  featured?: boolean;
}

export const useListings = ({ categoryFilter, subcategoryFilter, selectedLocation, featured }: UseListingsProps) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['listings', categoryFilter, subcategoryFilter, selectedLocation, featured],
    queryFn: async () => {
      console.log('Fetching listings with filters:', { categoryFilter, subcategoryFilter, selectedLocation, featured });
      
      try {
        let query = supabase
          .from('listings')
          .select('*')
          .eq('status', 'approved')
          .is('deleted_at', null); // Only show non-deleted listings

        if (selectedLocation) {
          const locationParts = selectedLocation.split('|');
          const placeId = locationParts[locationParts.length - 1];
          
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
            query = supabase.rpc('get_listings_by_location', {
              location_query: placeId
            });
          }
        }

        if (categoryFilter) {
          query = query.eq('category', categoryFilter);
        }

        if (subcategoryFilter) {
          query = query.eq('subcategory', subcategoryFilter);
        }

        if (featured) {
          query = query.eq('featured', true);
        }

        // Order by most recent first
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching listings:', error);
          throw error;
        }

        console.log('Fetched listings:', data);
        return data as Listing[];
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
};
