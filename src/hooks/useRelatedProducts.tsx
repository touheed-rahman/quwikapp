
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCondition } from "@/types/categories";

export const useRelatedProducts = (productId: string | undefined, category: string | undefined) => {
  return useQuery({
    queryKey: ['related-products', category],
    enabled: !!category,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('category', category)
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
