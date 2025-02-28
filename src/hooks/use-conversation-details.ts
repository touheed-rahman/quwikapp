
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { ConversationDetails } from '@/components/chat/types/chat-detail';

export function useConversationDetails(
  conversationId: string | undefined,
  sessionUser: any | null
) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversationDetails, setConversationDetails] = useState<ConversationDetails | null>(null);

  useEffect(() => {
    if (!conversationId || !sessionUser) return;

    const fetchConversationDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            seller:profiles!conversations_seller_id_fkey(id, full_name),
            buyer:profiles!conversations_buyer_id_fkey(id, full_name),
            listing:listings(id, title, price, status, deleted_at)
          `)
          .eq('id', conversationId)
          .eq('deleted', false) // Only select non-deleted conversations
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          const listingId = localStorage.getItem('intended_conversation');
          if (listingId) {
            const { data: listing, error: listingError } = await supabase
              .from('listings')
              .select('*, profiles:user_id(*)')
              .eq('id', listingId)
              .single();

            if (listingError) throw listingError;

            const { data: newConversation, error: createError } = await supabase
              .from('conversations')
              .insert({
                listing_id: listingId,
                buyer_id: sessionUser.id,
                seller_id: listing.user_id,
                deleted: false // Initialize as not deleted
              })
              .select(`
                *,
                seller:profiles!conversations_seller_id_fkey(id, full_name),
                buyer:profiles!conversations_buyer_id_fkey(id, full_name),
                listing:listings(id, title, price, status, deleted_at)
              `)
              .single();

            if (createError) throw createError;

            setConversationDetails(newConversation);
            localStorage.removeItem('intended_conversation');
            return;
          }

          toast({
            variant: "destructive",
            title: "Conversation not found",
            description: "This conversation does not exist or you don't have access to it."
          });
          navigate('/');
          return;
        }

        if (data.buyer_id !== sessionUser.id && data.seller_id !== sessionUser.id) {
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "You don't have access to this conversation."
          });
          navigate('/');
          return;
        }

        setConversationDetails(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load conversation details"
        });
      }
    };

    fetchConversationDetails();
  }, [conversationId, sessionUser, toast, navigate]);

  return conversationDetails;
}
