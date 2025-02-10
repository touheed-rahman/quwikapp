
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import LocationSelector from "@/components/LocationSelector";
import { useLocation } from "@/contexts/LocationContext";
import { supabase } from "@/integrations/supabase/client";
import { ProductCondition } from "@/types/categories";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

const SubcategoryPage = () => {
  const { category, subcategory } = useParams();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("newest");
  const [condition, setCondition] = useState<string>("all");
  const { selectedLocation, setSelectedLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['subcategory-listings', category, subcategory, sortBy, condition, selectedLocation, searchQuery],
    queryFn: async () => {
      try {
        console.log('Fetching listings with params:', { category, subcategory, sortBy, condition, selectedLocation, searchQuery });
        
        let query = supabase
          .from('listings')
          .select('*')
          .eq('status', 'approved')
          .eq('category', category)
          .eq('subcategory', subcategory);

        if (condition !== 'all') {
          query = query.eq('condition', condition);
        }

        if (selectedLocation) {
          const placeId = selectedLocation.split('|')[1];
          if (placeId) {
            query = query.eq('location', selectedLocation);
          }
        }

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
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

        console.log('Fetched listings:', data);
        return data || [];
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
    return "https://via.placeholder.com/300";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">
            {subcategory} in {category}
          </h1>
          
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search in this category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <LocationSelector 
              value={selectedLocation} 
              onChange={setSelectedLocation}
            />

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading listings...</div>
        ) : listings.length === 0 ? (
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
        ) : (
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
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SubcategoryPage;
