
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
          .select()
          .eq('status', 'approved')
          .is('deleted_at', null);

        if (selectedLocation) {
          const locationParts = selectedLocation.split('|');
          const placeId = locationParts[locationParts.length - 1];
          
          const { data: locationData, error: locationError } = await supabase
            .from('location_cache')
            .select('latitude, longitude')
            .eq('place_id', placeId)
            .single();

          if (locationError) {
            console.error('Error fetching location data:', locationError);
            throw locationError;
          }

          if (locationData) {
            console.log('Found location data:', locationData);
            const { data: nearbyListings, error: nearbyError } = await supabase
              .rpc('get_listings_by_location', {
                search_lat: locationData.latitude,
                search_long: locationData.longitude,
                radius_km: 20
              });

            if (nearbyError) {
              console.error('Error fetching nearby listings:', nearbyError);
              throw nearbyError;
            }

            console.log('Fetched nearby listings:', nearbyListings);
            
            // Filter the nearby listings based on category and subcategory if needed
            let filteredListings = nearbyListings;
            if (categoryFilter) {
              filteredListings = filteredListings.filter(listing => listing.category === categoryFilter);
            }
            if (subcategoryFilter) {
              filteredListings = filteredListings.filter(listing => listing.subcategory === subcategoryFilter);
            }
            if (featured) {
              filteredListings = filteredListings.filter(listing => listing.featured);
            }

            return filteredListings;
          }
        }

        // If no location selected or location not found, apply regular filters
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

        if (!listings || listings.length === 0) {
          console.log('No listings found');
          return [];
        }

        console.log('Raw listings from database:', listings);

        // Sort listings to show featured items first, then by creation date
        const sortedListings = listings.sort((a, b) => {
          // First, sort by featured status
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          // Then sort by creation date (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        return sortedListings;
      } catch (error) {
        console.error('Error in listing query:', error);
        toast({
          title: "Error",
          description: "Failed to fetch listings. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: true,
  });
};
