
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
  description: string;
  subcategory: string;
  brand?: string;
  admin_notes?: string;
  deleted_at?: string;
  featured_requested?: boolean;
  view_count?: number;
  save_count?: number;
  km_driven?: number | null;
  distance?: number;
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
        if (selectedLocation) {
          const locationParts = selectedLocation.split('|');
          const placeId = locationParts[locationParts.length - 1];
          
          // Get coordinates from location cache
          const { data: locationData } = await supabase
            .from('location_cache')
            .select('latitude, longitude')
            .eq('place_id', placeId)
            .maybeSingle();

          if (locationData) {
            console.log('Found location data:', locationData);
            let query = supabase.rpc('get_listings_by_location', {
              search_lat: locationData.latitude,
              search_long: locationData.longitude,
              radius_km: 20
            });

            // Apply additional filters
            if (categoryFilter) {
              query = query.eq('category', categoryFilter);
            }
            if (subcategoryFilter) {
              query = query.eq('subcategory', subcategoryFilter);
            }
            if (featured) {
              query = query.eq('featured', true);
            }

            const { data: listings, error } = await query;
            
            if (error) {
              console.error('Error fetching listings:', error);
              throw error;
            }

            console.log('Fetched location-based listings:', listings);
            return listings || [];
          }
        }

        // If no location selected or location data not found, use regular query
        let query = supabase
          .from('listings')
          .select()
          .eq('status', 'approved')
          .is('deleted_at', null);

        if (categoryFilter) {
          query = query.eq('category', categoryFilter);
        }
        if (subcategoryFilter) {
          query = query.eq('subcategory', subcategoryFilter);
        }
        if (featured) {
          query = query.eq('featured', true);
        }

        // Order by creation date (newest first)
        query = query.order('created_at', { ascending: false });

        const { data: listings, error } = await query;

        if (error) {
          console.error('Error fetching listings:', error);
          throw error;
        }

        console.log('Fetched regular listings:', listings);
        return listings || [];

      } catch (error) {
        console.error('Error in listing query:', error);
        toast({
          title: "Error",
          description: "Failed to fetch listings. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: true,
  });
};
