
import { useState, useEffect } from "react";
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [datePosted, setDatePosted] = useState("all");
  
  // Query to find the min and max price for this category/subcategory
  const { data: priceStats } = useQuery({
    queryKey: ['price-stats', category, subcategory],
    queryFn: async () => {
      try {
        let query = supabase.rpc('get_price_range', {
          category_param: category || '',
          subcategory_param: subcategory || ''
        });
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching price stats:', error);
          return { min_price: 0, max_price: 1000000 };
        }
        
        return data || { min_price: 0, max_price: 1000000 };
      } catch (error) {
        console.error('Error in price stats query:', error);
        return { min_price: 0, max_price: 1000000 };
      }
    },
    enabled: !!category && !!subcategory
  });
  
  // Update price range when price stats are loaded
  useEffect(() => {
    if (priceStats) {
      const minPrice = priceStats.min_price || 0;
      const maxPrice = priceStats.max_price || 1000000;
      setPriceRange([minPrice, maxPrice]);
    }
  }, [priceStats]);

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
    featuredListings,
    priceRange,
    setPriceRange,
    datePosted,
    setDatePosted,
    minPrice: priceStats?.min_price || 0,
    maxPrice: priceStats?.max_price || 1000000
  };
}
