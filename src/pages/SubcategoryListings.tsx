
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ProductCondition } from "@/types/categories";

const SubcategoryListings = () => {
  const { subcategory } = useParams();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['subcategory-listings', subcategory],
    queryFn: async () => {
      // Get listings from last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('subcategory', subcategory)
        .eq('status', 'approved')
        .gt('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getFirstImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from('listings').getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <h1 className="text-2xl font-bold mb-6">
          Recent Listings in {subcategory}
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No recent listings found in this subcategory
          </p>
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
                date={new Date(listing.created_at).toLocaleDateString()}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SubcategoryListings;
