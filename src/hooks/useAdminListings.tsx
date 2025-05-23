
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { type Listing } from "@/components/admin/types";

export function useAdminListings(filter: string = 'all') {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const { data: listings, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-listings', filter],
    queryFn: async () => {
      console.log('Fetching admin listings with filter:', filter);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Authentication required');
      }

      const { data: isAdmin } = await supabase.rpc('is_admin', { 
        user_uid: user.id 
      });

      if (!isAdmin) {
        throw new Error('Unauthorized');
      }

      let query = supabase
        .from('listings')
        .select('*, seller:profiles(*))')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      // Apply filters based on dashboard metrics selection
      if (filter === 'pending') {
        query = query.eq('status', 'pending');
      } else if (filter === 'approved') {
        query = query.eq('status', 'approved');
      } else if (filter === 'rejected') {
        query = query.eq('status', 'rejected');
      } else if (filter === 'featured') {
        query = query.eq('featured', true);
      } else if (filter === 'feature-requests') {
        query = query.eq('featured_requested', true);
      }

      const { data: listingsData, error } = await query;

      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }
      
      console.log('Fetched listings:', listingsData);
      return listingsData as unknown as Listing[];
    }
  });

  const handleStatusUpdate = async (listingId: string, status: string) => {
    console.log('Updating listing status:', { listingId, status });
    const { error } = await supabase
      .from('listings')
      .update({ 
        status,
        reviewed_by: (await supabase.auth.getUser()).data.user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', listingId);

    if (error) {
      console.error('Error updating listing status:', error);
      toast({
        title: "Error",
        description: "Failed to update listing status",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `Listing ${status} successfully`,
      });
      refetch();
    }
  };

  const handleFeaturedToggle = async (listingId: string, featured: boolean) => {
    console.log('Updating featured status:', { listingId, featured });
    const { error } = await supabase
      .from('listings')
      .update({ 
        featured,
        featured_requested: false // Clear the request flag when approved
      })
      .eq('id', listingId);

    if (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `Listing ${featured ? 'featured' : 'unfeatured'} successfully`,
      });
      refetch();
    }
  };

  const handleDelete = async (listingId: string) => {
    console.log('Deleting listing:', listingId);
    
    try {
      // First, get all conversations related to this listing
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listingId);

      if (convError) {
        console.error('Error fetching conversations:', convError);
        throw convError;
      }

      // Delete offers for all related conversations
      if (conversations && conversations.length > 0) {
        const conversationIds = conversations.map(conv => conv.id);
        const { error: offersError } = await supabase
          .from('offers')
          .delete()
          .in('conversation_id', conversationIds);

        if (offersError) {
          console.error('Error deleting offers:', offersError);
          throw offersError;
        }

        // Delete messages for all conversations
        const { error: messagesError } = await supabase
          .from('messages')
          .delete()
          .in('conversation_id', conversationIds);

        if (messagesError) {
          console.error('Error deleting messages:', messagesError);
          throw messagesError;
        }

        // Now delete the conversations themselves
        const { error: conversationsError } = await supabase
          .from('conversations')
          .delete()
          .eq('listing_id', listingId);

        if (conversationsError) {
          console.error('Error deleting conversations:', conversationsError);
          throw conversationsError;
        }
      }

      // Delete associated wishlists
      const { error: wishlistError } = await supabase
        .from('wishlists')
        .delete()
        .eq('listing_id', listingId);

      if (wishlistError) {
        console.error('Error deleting wishlists:', wishlistError);
        throw wishlistError;
      }

      // Finally delete the listing itself
      const { error: listingError } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (listingError) {
        console.error('Error deleting listing:', listingError);
        throw listingError;
      }

      toast({
        title: "Success",
        description: "Listing and all associated data permanently deleted",
      });
      refetch();
    } catch (error) {
      console.error('Error in deletion process:', error);
      toast({
        title: "Error",
        description: "Failed to delete listing and associated data",
        variant: "destructive"
      });
    }
  };

  const filteredListings = listings?.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    listings,
    filteredListings,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    handleStatusUpdate,
    handleFeaturedToggle,
    handleDelete,
    refetch
  };
}
