
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import StatusTabs from "@/components/my-ads/StatusTabs";
import ListingGrid from "@/components/my-ads/ListingGrid";
import { ProductCondition } from "@/types/categories";
import { useSearchParams } from "react-router-dom";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface ListingUpdate extends RealtimePostgresChangesPayload<{
  [key: string]: any;
}> {
  new: {
    status: string;
    [key: string]: any;
  };
  old: {
    status: string;
    [key: string]: any;
  } | null;
}

const MyAds = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || "pending";
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const { data: listings = [], isLoading, refetch } = useQuery({
    queryKey: ['my-listings', selectedTab],
    queryFn: async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', authData.user.id)
        .eq('status', selectedTab)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(listing => ({
        ...listing,
        condition: listing.condition as ProductCondition
      }));
    }
  });

  // Subscribe to real-time updates with optimized performance
  useEffect(() => {
    const setupRealtime = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const channel = supabase
        .channel('my-listings-changes')
        .on<ListingUpdate>(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'listings',
            filter: `user_id=eq.${authData.user.id}`
          },
          (payload) => {
            console.log('Received real-time update:', payload);
            if (payload.new.status === selectedTab || payload.old?.status !== payload.new.status) {
              refetch();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtime();
  }, [refetch, selectedTab]);

  const markAsSold = async (listingId: string) => {
    const { error } = await supabase
      .from('listings')
      .update({ status: 'sold' })
      .eq('id', listingId);

    if (error) {
      console.error('Error marking as sold:', error);
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

  const handleListingDeleted = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 text-foreground">My Ads</h1>
        
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
          <StatusTabs selectedTab={selectedTab} />

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <TabsContent value={selectedTab} className="mt-6 px-4">
              {listings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No listings found in this category
                </p>
              ) : (
                <ListingGrid
                  listings={listings}
                  onMarkAsSold={selectedTab === 'approved' ? markAsSold : undefined}
                  showSoldButton={selectedTab === 'approved'}
                  onListingDeleted={handleListingDeleted}
                />
              )}
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default MyAds;
