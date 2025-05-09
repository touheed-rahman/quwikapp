
import { ProductCondition } from "@/types/categories";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { addDays, startOfDay, startOfWeek, startOfMonth } from "date-fns";

interface SubcategoryListingsProps {
  category: string | undefined;
  subcategory: string | undefined;
  sortBy: string;
  condition: string;
  selectedLocation: string;
  searchQuery: string;
  featuredListings: any[];
  priceRange?: [number, number];
  datePosted?: string;
}

const SubcategoryListings = ({
  category,
  subcategory,
  sortBy,
  condition,
  selectedLocation,
  searchQuery,
  featuredListings,
  priceRange = [0, 1000000],
  datePosted = 'all'
}: SubcategoryListingsProps) => {
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['subcategory-listings', category, subcategory, sortBy, condition, selectedLocation, searchQuery, priceRange, datePosted],
    queryFn: async () => {
      try {
        console.log('Fetching listings with params:', { category, subcategory, sortBy, condition, selectedLocation, searchQuery, priceRange, datePosted });
        
        let query = supabase
          .from('listings')
          .select('*')
          .eq('status', 'approved')
          .is('deleted_at', null);

        // Add category filter if present
        if (category) {
          query = query.eq('category', category);
        }

        // Add subcategory filter if present
        if (subcategory) {
          query = query.eq('subcategory', subcategory);
        }

        if (condition !== 'all') {
          query = query.eq('condition', condition);
        }

        if (selectedLocation) {
          const cityName = selectedLocation.split('|')[0];
          if (cityName) {
            query = query.ilike('location', `%${cityName}%`);
          }
        }

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }
        
        // Apply price range filter
        if (priceRange && priceRange.length === 2) {
          query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
        }
        
        // Apply date filter
        if (datePosted !== 'all') {
          let dateFilter;
          const now = new Date();
          
          switch (datePosted) {
            case 'today':
              dateFilter = startOfDay(now).toISOString();
              break;
            case 'week':
              dateFilter = startOfWeek(now).toISOString();
              break;
            case 'month':
              dateFilter = startOfMonth(now).toISOString();
              break;
            default:
              dateFilter = null;
          }
          
          if (dateFilter) {
            query = query.gte('created_at', dateFilter);
          }
        }

        if (sortBy === 'price-asc') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price-desc') {
          query = query.order('price', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching listings:', error);
          throw error;
        }

        // Filter out the featured listings that would be shown at the top
        const featuredIds = new Set(featuredListings.map(item => item.id));
        return (data || []).filter(item => !featuredIds.has(item.id));
      } catch (error) {
        console.error('Error in queryFn:', error);
        return [];
      }
    },
    enabled: !!category && !!subcategory // Only run query when category and subcategory are available
  });

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading listings...</div>;
  }

  if (listings.length === 0 && featuredListings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">
          No listings found for this subcategory
        </p>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search terms or filters
          </p>
        )}
      </div>
    );
  }

  if (listings.length === 0) return null;

  return (
    <>
      {featuredListings.length > 0 && (
        <h2 className="text-xl font-bold mb-4">More {subcategory}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <ProductCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            location={listing.location || "Location not specified"}
            image={getFirstImageUrl(listing.images)}
            condition={listing.condition as ProductCondition}
            date={new Date(listing.created_at).toLocaleDateString()}
          />
        ))}
      </div>
    </>
  );
};

export default SubcategoryListings;
