
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { ConversationDetails } from '@/components/chat/types/chat-detail';

export function useChatAuth(conversationId: string | undefined) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [conversationDetails, setConversationDetails] = useState<ConversationDetails | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (conversationId) {
          localStorage.setItem('intended_conversation', conversationId);
        }
        navigate('/profile');
        return;
      }
      setSessionUser(session.user);
    };
    getSession();
  }, [navigate, conversationId]);

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
            listing:listings(title, price)
          `)
          .eq('id', conversationId)
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
              })
              .select(`
                *,
                seller:profiles!conversations_seller_id_fkey(id, full_name),
                buyer:profiles!conversations_buyer_id_fkey(id, full_name),
                listing:listings(title, price)
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

  return { sessionUser, conversationDetails };
}
