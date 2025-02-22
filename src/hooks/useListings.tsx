
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
  city_id?: string;
}

interface UseListingsProps {
  selectedLocation: string | null;
}

export const useListings = ({ selectedLocation }: UseListingsProps) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['listings', selectedLocation],
    queryFn: async () => {
      try {
        console.log('Fetching listings with location:', selectedLocation);

        let query = supabase
          .from('listings')
          .select('*')
          .eq('status', 'approved')
          .is('deleted_at', null);

        // Apply location filter if selected
        if (selectedLocation) {
          const locationParts = selectedLocation.split('|');
          const cityName = locationParts[0]; // Get city name from first part
          console.log('Filtering by city name:', cityName);
          
          // Use ilike for case-insensitive partial match on location field
          query = query.ilike('location', `%${cityName}%`);
        }

        // Add ordering to show featured listings first and newest listings next
        query = query.order('featured', { ascending: false })
                    .order('created_at', { ascending: false });

        const { data: listings, error } = await query;

        if (error) {
          console.error('Error fetching listings:', error);
          throw error;
        }

        console.log('Fetched listings:', listings);

        // Map the listings and assert the condition type
        const typedListings = (listings || []).map(listing => ({
          ...listing,
          condition: listing.condition as ProductCondition
        }));

        return typedListings;
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
