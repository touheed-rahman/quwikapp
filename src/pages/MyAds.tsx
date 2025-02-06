
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const MyAds = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("pending");

  const { data: listings = [], isLoading, refetch } = useQuery({
    queryKey: ['my-listings', selectedTab],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', selectedTab)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const markAsSold = async (listingId: string) => {
    const { error } = await supabase
      .from('listings')
      .update({ status: 'sold' })
      .eq('id', listingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark listing as sold",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Listing marked as sold"
      });
      refetch();
    }
  };

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
        <h1 className="text-2xl font-bold mb-6">My Ads</h1>
        
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="pending">Under Review</TabsTrigger>
            <TabsTrigger value="approved">Online</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <TabsContent value={selectedTab} className="mt-0">
              {listings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No listings found in this category
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {listings.map((listing) => (
                    <div key={listing.id} className="relative">
                      <ProductCard
                        id={listing.id}
                        title={listing.title}
                        price={listing.price}
                        location={listing.location || "Location not specified"}
                        image={getFirstImageUrl(listing.images)}
                        condition={listing.condition}
                      />
                      {listing.status === 'approved' && (
                        <Button
                          className="absolute bottom-2 right-2 bg-primary"
                          size="sm"
                          onClick={() => markAsSold(listing.id)}
                        >
                          Mark as Sold
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default MyAds;
