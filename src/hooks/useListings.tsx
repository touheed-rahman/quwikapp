
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
        let locationQuery;
        if (selectedLocation) {
          const locationParts = selectedLocation.split('|');
          const placeId = locationParts[locationParts.length - 1];
          
          const { data: locationData } = await supabase
            .from('location_cache')
            .select('latitude, longitude')
            .eq('place_id', placeId)
            .maybeSingle();

          if (locationData) {
            locationQuery = supabase.rpc('get_listings_by_location', {
              location_query: null,
              search_lat: locationData.latitude,
              search_long: locationData.longitude,
              radius_km: 20
            });
          } else {
            locationQuery = supabase.rpc('get_listings_by_location', {
              location_query: placeId
            });
          }
        }

        // Base query for non-location based search
        let baseQuery = supabase
          .from('listings')
          .select()
          .eq('status', 'approved')
          .is('deleted_at', null);

        if (categoryFilter) {
          baseQuery = baseQuery.eq('category', categoryFilter);
        }

        if (subcategoryFilter) {
          baseQuery = baseQuery.eq('subcategory', subcategoryFilter);
        }

        // If specifically fetching featured listings
        if (featured) {
          baseQuery = baseQuery.eq('featured', true);
        }

        // Execute the appropriate query
        const { data: listings, error } = await (locationQuery || baseQuery);

        if (error) {
          console.error('Error fetching listings:', error);
          throw error;
        }

        // Sort listings to show featured items first, then by creation date
        const sortedListings = (listings as Listing[]).sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        console.log('Fetched and sorted listings:', sortedListings);
        return sortedListings;
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
