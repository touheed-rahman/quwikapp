
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
  year?: number | null;
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
        let query = supabase
          .from('listings')
          .select('*')
          .eq('status', 'approved')
          .is('deleted_at', null)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (selectedLocation) {
          const locationParts = selectedLocation.split('|');
          const cityName = locationParts[0];
          query = query.ilike('location', `%${cityName}%`);
        }

        const { data: listings, error } = await query;

        if (error) {
          throw error;
        }

        return (listings || []).map(listing => ({
          ...listing,
          condition: listing.condition as ProductCondition,
          year: listing.year || null,
          km_driven: listing.km_driven || null
        }));
      } catch (error) {
        console.error('Error in listing query:', error);
        toast({
          title: "Error",
          description: "Failed to fetch listings",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 1000 * 30, // Cache for 30 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
};
