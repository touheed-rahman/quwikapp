
import { useEffect, useState } from "react";
import { ProductCondition } from "@/types/categories";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface FeaturedSubcategoryListingsProps {
  category: string | undefined;
  subcategory: string | undefined;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  created_at: string;
  condition: ProductCondition;
  category: string;
  subcategory: string;
  status: string;
  featured: boolean;
}

const FeaturedSubcategoryListings = ({ category, subcategory }: FeaturedSubcategoryListingsProps) => {
  const [randomFeaturedListings, setRandomFeaturedListings] = useState<Listing[]>([]);
  
  // Query for featured products in this subcategory (get all, then randomize)
  const { data: featuredListings = [], isLoading } = useQuery({
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
          .eq('featured', true);

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

  // Randomize and limit the featured listings
  useEffect(() => {
    if (featuredListings.length > 0) {
      // Shuffle the array
      const shuffled = [...featuredListings].sort(() => 0.5 - Math.random());
      // Take only first 4 items
      const formattedListings = shuffled.slice(0, 4).map(listing => ({
        ...listing,
        condition: listing.condition as ProductCondition
      }));
      
      setRandomFeaturedListings(formattedListings);
    } else {
      setRandomFeaturedListings([]);
    }
  }, [featuredListings]);

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
  };

  if (isLoading) return null;
  if (featuredListings.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-primary">Featured {subcategory}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {randomFeaturedListings.map((listing) => (
          <ProductCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            location={listing.location || "Location not specified"}
            image={getFirstImageUrl(listing.images)}
            condition={listing.condition}
            featured={true}
            date={new Date(listing.created_at).toLocaleDateString()}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSubcategoryListings;
