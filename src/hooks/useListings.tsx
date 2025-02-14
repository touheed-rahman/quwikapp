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
          const area = selectedLocation.split('|')[0];
          locationQuery = supabase.from('listings').select().ilike('location', `${area}%`);
        }

        // Base query to fetch all approved, non-deleted listings
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

        // Execute the appropriate query
        const { data: listings, error } = await (locationQuery || query);

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
        const sortedListings = (listings as Listing[]).sort((a, b) => {
          // First, sort by featured status
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          // Then sort by creation date (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        console.log('Sorted listings:', sortedListings);
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
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: true,
  });
};

