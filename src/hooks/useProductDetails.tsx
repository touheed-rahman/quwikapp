
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCondition } from "@/types/categories";

export const useProductDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:user_id (
            full_name,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Product not found');

      return {
        ...data,
        condition: data.condition as ProductCondition,
        seller: {
          name: data.profiles.full_name || 'Anonymous',
          memberSince: new Date(data.profiles.created_at).getFullYear().toString(),
          listings: 0,
        }
      };
    }
  });
};
