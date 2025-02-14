
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListingGridProps } from "./types";
import ListingItem from "./ListingItem";

const ListingGrid = ({ listings, onMarkAsSold, showSoldButton, onListingDeleted }: ListingGridProps) => {
  // Subscribe to real-time updates for view and save counts
  useEffect(() => {
    const channel = supabase
      .channel('listing-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings',
          filter: `id=in.(${listings.map(l => `'${l.id}'`).join(',')})`,
        },
        (payload) => {
          console.log('Received real-time update:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listings]);

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <ListingItem
          key={listing.id}
          listing={listing}
          onMarkAsSold={onMarkAsSold}
          showSoldButton={showSoldButton}
          onListingDeleted={onListingDeleted}
        />
      ))}
    </div>
  );
};

export default ListingGrid;
