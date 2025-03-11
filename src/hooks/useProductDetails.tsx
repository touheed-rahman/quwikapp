
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCondition } from "@/types/categories";

// Helper function to generate slug from title
export const generateProductSlug = (title: string, adNumber: string): string => {
  // Remove special characters, convert spaces to hyphens and lowercase it
  return `${title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)}-${adNumber}`;
};

// Helper to extract id from slug (used when navigating using slug)
export const extractIdFromSlug = (slug: string): string | null => {
  // Try to extract the ad number from the slug (format: title-QUWIK-XXXX)
  const idMatch = slug.match(/-QUWIK-([A-Z0-9]{4,})/);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }
  
  // If it's not a slug but a direct UUID, return it
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(slug)) {
    return slug;
  }
  
  return null;
};

export const useProductDetails = (idOrSlug: string | undefined) => {
  return useQuery({
    queryKey: ['product', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) throw new Error('Product ID is required');
      
      let id = idOrSlug;
      
      // If this is a slug, extract the ID/ad number
      const extractedId = extractIdFromSlug(idOrSlug);
      console.log("Extracted ID from slug:", extractedId);
      
      if (extractedId) {
        // First try looking for listings where the ID starts with the extracted code
        const { data: productByAdNumber, error } = await supabase
          .from('listings')
          .select('id')
          .ilike('id', `${extractedId}%`)
          .limit(1);
          
        if (productByAdNumber && productByAdNumber.length > 0) {
          id = productByAdNumber[0].id;
          console.log("Found product by ad number:", id);
        } else {
          // If that fails, try the old method directly using the ID
          id = extractedId;
        }
      }

      console.log("Final ID used for query:", id);

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

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }
      if (!data) {
        console.error("Product not found for ID:", id);
        throw new Error('Product not found');
      }

      // Generate an ad number based on the ID
      // Use the first 4 characters of the ID and format it as "QUWIK-XXXX"
      const adNumber = `QUWIK-${id.substring(0, 4).toUpperCase()}`;

      // Generate the SEO-friendly slug for this product
      const slug = generateProductSlug(data.title, adNumber);

      // Ensure specs is a proper object even if it's null or undefined
      const specs = data.specs && typeof data.specs === 'object' 
        ? data.specs as Record<string, any>
        : {};

      return {
        ...data,
        condition: data.condition as ProductCondition,
        adNumber,
        brand: data.brand || null,
        specs,
        slug
      };
    },
    enabled: !!idOrSlug,
    retry: 1,
  });
};
