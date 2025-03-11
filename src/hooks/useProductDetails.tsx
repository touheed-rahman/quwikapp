
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCondition } from "@/types/categories";

export const useProductDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');

      // First, increment the view count for this product
      try {
        // Get the current view count
        const { data: viewData } = await supabase
          .from('listings')
          .select('view_count')
          .eq('id', id)
          .single();
        
        // Calculate the new view count
        const newViewCount = ((viewData?.view_count || 0) + 1);
        
        // Update with the new view count
        const { error: updateError } = await supabase
          .from('listings')
          .update({ view_count: newViewCount })
          .eq('id', id);
        
        if (updateError) console.error('Error incrementing view count:', updateError);
      } catch (error) {
        console.error('Error in view count update process:', error);
      }

      // Then fetch the product details with updated view count
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

      // Ensure specs is a proper object even if it's null or undefined
      const specs = data.specs && typeof data.specs === 'object' 
        ? data.specs as Record<string, any>
        : {};

      return {
        ...data,
        condition: data.condition as ProductCondition,
        adNumber,
        brand: data.brand || null,
        specs
      };
    },
    enabled: !!id,
  });
};
