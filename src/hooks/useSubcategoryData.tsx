
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSubcategoryData() {
  const { category, subcategory } = useParams();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("newest");
  const [condition, setCondition] = useState<string>("all");
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");

  // Query for featured products in this subcategory (limit 4)
  const { data: featuredListings = [] } = useQuery({
    queryKey: ['featured-subcategory-listings', category, subcategory],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'approved')
          .is('deleted_at', null)
          .eq('category', category || '')
          .eq('subcategory', subcategory || '')
          .eq('featured', true)
          .limit(4);

        if (error) {
          console.error('Error fetching featured listings:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in featured listings queryFn:', error);
        return [];
      }
    },
    enabled: !!category && !!subcategory
  });

  return {
    category,
    subcategory,
    sortBy,
    setSortBy,
    condition,
    setCondition,
    selectedLocation,
    setSelectedLocation,
    searchQuery,
    setSearchQuery,
    featuredListings
  };
}
