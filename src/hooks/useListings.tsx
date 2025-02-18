
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
        if (selectedLocation) {
          const cityId = selectedLocation.split('|')[4];
          console.log('Filtering by city ID:', cityId);

          const { data: cityListings, error: cityError } = await supabase
            .rpc('get_listings_by_city', {
              p_city_id: cityId,
              radius_km: 50 // Increased radius for better results
            });

          if (cityError) {
            console.error('Error fetching city listings:', cityError);
            throw cityError;
          }

          let filteredListings = cityListings || [];

          // Apply additional filters
          if (categoryFilter) {
            filteredListings = filteredListings.filter(listing => listing.category === categoryFilter);
          }
          if (subcategoryFilter) {
            filteredListings = filteredListings.filter(listing => listing.subcategory === subcategoryFilter);
          }
          if (featured) {
            filteredListings = filteredListings.filter(listing => listing.featured);
          }

          const typedListings = filteredListings.map(listing => ({
            ...listing,
            condition: listing.condition as ProductCondition
          }));

          return typedListings.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
        }

        // If no location selected, fetch all listings with filters
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

        const { data: listings, error } = await query;

        if (error) {
          console.error('Error fetching listings:', error);
          throw error;
        }

        if (!listings || listings.length === 0) {
          console.log('No listings found');
          return [];
        }

        const typedListings = listings.map(listing => ({
          ...listing,
          condition: listing.condition as ProductCondition
        }));

        return typedListings.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
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
