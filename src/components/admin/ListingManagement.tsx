import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ListingSearchBar from "./ListingSearchBar";
import ListingTable from "./ListingTable";
import { type Listing } from "./types";

const ListingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: async () => {
      console.log('Fetching admin listings...');
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          seller:profiles!listings_user_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }
      
      console.log('Fetched listings:', data);
      return data as Listing[];
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

  const filteredListings = listings?.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ListingSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      <ListingTable 
        listings={filteredListings || []}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default ListingManagement;