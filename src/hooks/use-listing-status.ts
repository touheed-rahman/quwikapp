
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Listing } from '@/components/chat/types/chat-detail';

export function useListingStatus(listingId: string | undefined) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [disabledReason, setDisabledReason] = useState<string>('');

  useEffect(() => {
    if (!listingId) return;

    const checkListingStatus = async () => {
      const { data: listing, error } = await supabase
        .from('listings')
        .select('status, deleted_at')
        .eq('id', listingId)
        .single();

      if (error) {
        console.error('Error fetching listing status:', error);
        return;
      }

      if (listing.deleted_at) {
        setIsDisabled(true);
        setDisabledReason('This item has been deleted');
      } else if (listing.status === 'sold') {
        setIsDisabled(true);
        setDisabledReason('This item has been sold');
      } else {
        setIsDisabled(false);
        setDisabledReason('');
      }
    };

    checkListingStatus();

    const channel = supabase
      .channel(`listing_status_${listingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings',
          filter: `id=eq.${listingId}`
        },
        (payload: { new: Listing }) => {
          const listing = payload.new;
          if (listing.deleted_at) {
            setIsDisabled(true);
            setDisabledReason('This item has been deleted');
          } else if (listing.status === 'sold') {
            setIsDisabled(true);
            setDisabledReason('This item has been sold');
          } else {
            setIsDisabled(false);
            setDisabledReason('');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listingId]);

  return { isDisabled, disabledReason };
}
