
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { Listing } from '@/components/chat/types/chat-detail';

export function useListingStatus(listingId: string | undefined) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [disabledReason, setDisabledReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!listingId) return;

    const checkListingStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('status, deleted_at')
          .eq('id', listingId)
          .single();

        if (error) throw error;

        if (data.deleted_at) {
          setIsDisabled(true);
          setDisabledReason('This listing has been deleted.');
        } else if (data.status === 'sold') {
          setIsDisabled(true);
          setDisabledReason('This listing has been marked as sold.');
        } else if (data.status === 'suspended') {
          setIsDisabled(true);
          setDisabledReason('This listing has been suspended by admin.');
        } else {
          setIsDisabled(false);
          setDisabledReason('');
        }
      } catch (error) {
        console.error('Error checking listing status:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check listing status."
        });
      }
    };

    checkListingStatus();
  }, [listingId, toast]);

  return { isDisabled, disabledReason };
}
