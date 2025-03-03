
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCondition } from "@/types/categories";

export const useRelatedProducts = (productId: string | undefined, category: string | undefined, subcategory: string | undefined) => {
  return useQuery({
    queryKey: ['related-products', category, subcategory],
    enabled: !!category && !!subcategory,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('category', category)
        .eq('subcategory', subcategory)  // Added subcategory filter
        .eq('status', 'approved')
        .neq('id', productId)
        .limit(4);

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        location: item.location,
        image: item.images[0] ? 
          supabase.storage.from('listings').getPublicUrl(item.images[0]).data.publicUrl 
          : "https://via.placeholder.com/300",
        condition: item.condition as ProductCondition,
      }));
    }
  });
};
