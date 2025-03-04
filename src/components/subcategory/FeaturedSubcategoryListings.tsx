
import { ProductCondition } from "@/types/categories";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeaturedSubcategoryListingsProps {
  category: string | undefined;
  subcategory: string | undefined;
}

const FeaturedSubcategoryListings = ({ category, subcategory }: FeaturedSubcategoryListingsProps) => {
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

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
  };

  if (featuredListings.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-primary">Featured {subcategory}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {featuredListings.map((listing) => (
          <ProductCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            location={listing.location || "Location not specified"}
            image={getFirstImageUrl(listing.images)}
            condition={listing.condition as ProductCondition}
            featured={true}
            date={new Date(listing.created_at).toLocaleDateString()}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSubcategoryListings;
