
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Loader2, Package } from "lucide-react";
import StatusTabs from "@/components/my-ads/StatusTabs";
import ListingGrid from "@/components/my-ads/ListingGrid";
import { ProductCondition } from "@/types/categories";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import ChatWindow from "@/components/chat/ChatWindow";

interface Listing {
  id: string;
  status: string;
  condition: ProductCondition;
  [key: string]: any;
}

type DatabaseChangesPayload = RealtimePostgresChangesPayload<{
  old: Listing | null;
  new: Listing | null;
}>;

const MyAds = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get('tab') || "approved"; // Default to approved
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Redirect to approved tab if no tab is selected
  useEffect(() => {
    if (!searchParams.get('tab')) {
      navigate('?tab=approved', { replace: true });
    }
  }, [searchParams, navigate]);

  // Update selectedTab when URL params change
  useEffect(() => {
    setSelectedTab(searchParams.get('tab') || "approved");
  }, [searchParams]);

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

  useEffect(() => {
    const setupRealtime = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const channel = supabase
        .channel('my-listings-changes')
        .on<DatabaseChangesPayload>(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'listings',
            filter: `user_id=eq.${authData.user.id}`
          },
          (payload) => {
            console.log('Received real-time update:', payload);

            // Handle different event types
            if (payload.eventType === 'DELETE') {
              refetch();
              return;
            }

            // For INSERT events
            if (payload.eventType === 'INSERT' && payload.new) {
              const newListing = payload.new;
              if ('status' in newListing && newListing.status === selectedTab) {
                refetch();
              }
              return;
            }

            // For UPDATE events
            if (payload.eventType === 'UPDATE' && payload.new && payload.old) {
              const newListing = payload.new;
              const oldListing = payload.old;
              if (
                'status' in newListing && 
                'status' in oldListing && 
                (newListing.status === selectedTab || 
                oldListing.status !== newListing.status)
              ) {
                refetch();
              }
              return;
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
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-6"
        >
          <Package className="h-5 w-5 text-primary mr-2" />
          <h1 className="text-2xl font-bold text-foreground">My Ads</h1>
        </motion.div>
        
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
          <StatusTabs selectedTab={selectedTab} />

          {isLoading ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading your listings...</p>
            </motion.div>
          ) : (
            <TabsContent value={selectedTab} className="mt-6">
              {listings.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center py-12 px-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-primary/10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Package className="h-16 w-16 text-primary/20 mb-4" />
                  <h3 className="text-lg font-medium text-center mb-2">No listings found</h3>
                  <p className="text-center text-muted-foreground max-w-md">
                    You don't have any {selectedTab} listings yet
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  <ListingGrid
                    listings={listings}
                    onMarkAsSold={selectedTab === 'approved' ? markAsSold : undefined}
                    showSoldButton={selectedTab === 'approved'}
                    onListingDeleted={handleListingDeleted}
                  />
                </motion.div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default MyAds;
