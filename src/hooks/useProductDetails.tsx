
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCondition } from "@/types/categories";

export const useProductDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');

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

      // Generate an ad number based on the ID
      // Use the first 4 characters of the ID and format it as "QUWIK-XXXX"
      const adNumber = `QUWIK-${id.substring(0, 4).toUpperCase()}`;

      return {
        ...data,
        condition: data.condition as ProductCondition,
        adNumber,
      };
    },
    enabled: !!id,
  });
};
