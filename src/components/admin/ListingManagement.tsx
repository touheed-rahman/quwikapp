
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ListingSearchBar from "./ListingSearchBar";
import ListingTable from "./ListingTable";
import { type Listing } from "./types";
import { Loader2 } from "lucide-react";

const ListingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const location = useLocation();
  const filter = location.state?.filter || 'all';

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
      .update({ featured })
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
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('listings')
      .update({ 
        deleted_at: now,
        status: 'deleted'
      })
      .eq('id', listingId);

    if (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
      refetch();
    }
  };

  const filteredListings = listings?.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading listings. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ListingSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : listings?.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No listings found
        </div>
      ) : (
        <ListingTable 
          listings={filteredListings || []}
          onStatusUpdate={handleStatusUpdate}
          onFeaturedToggle={handleFeaturedToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ListingManagement;
