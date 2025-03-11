
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ConversationDetails } from '@/components/chat/types/chat-detail';

export function useConversationDetails(
  conversationId: string | undefined,
  sessionUser: any | null
) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversationDetails, setConversationDetails] = useState<ConversationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!conversationId || !sessionUser) {
      setIsLoading(false);
      return;
    }

    const fetchConversationDetails = async () => {
      try {
        setIsLoading(true);
        
        // Get the conversation details with better error handling
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            seller:profiles!conversations_seller_id_fkey(id, full_name),
            buyer:profiles!conversations_buyer_id_fkey(id, full_name),
            listing:listings(id, title, price, status, deleted_at)
          `)
          .eq('id', conversationId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching conversation:', error);
          setIsLoading(false);
          return;
        }

        if (!data) {
          console.log('Conversation not found, checking for intended conversation');
          const listingId = localStorage.getItem('intended_conversation');
          
          if (listingId) {
            try {
              const { data: listing, error: listingError } = await supabase
                .from('listings')
                .select('*, profiles:user_id(*)')
                .eq('id', listingId)
                .single();

              if (listingError) {
                console.error('Error fetching listing:', listingError);
                throw listingError;
              }

              // Create a new conversation
              const { data: newConversation, error: createError } = await supabase
                .from('conversations')
                .insert({
                  listing_id: listingId,
                  buyer_id: sessionUser.id,
                  seller_id: listing.user_id
                })
                .select(`
                  *,
                  seller:profiles!conversations_seller_id_fkey(id, full_name),
                  buyer:profiles!conversations_buyer_id_fkey(id, full_name),
                  listing:listings(id, title, price, status, deleted_at)
                `)
                .single();

              if (createError) {
                console.error('Error creating conversation:', createError);
                throw createError;
              }

              setConversationDetails(newConversation);
              localStorage.removeItem('intended_conversation');
              setIsLoading(false);
              return;
            } catch (innerError) {
              console.error('Error in conversation creation:', innerError);
            }
          }

          // Only navigate away if we truly couldn't find or create the conversation
          toast({
            title: "Conversation not found",
            description: "This conversation doesn't exist anymore or you don't have access to it."
          });
          navigate('/');
          return;
        }

        // Check if the user is part of the conversation
        if (data.buyer_id !== sessionUser.id && data.seller_id !== sessionUser.id) {
          toast({
            title: "Access denied",
            description: "You don't have access to this conversation."
          });
          navigate('/');
          return;
        }

        setConversationDetails(data);
      } catch (error: any) {
        console.error('Error fetching conversation details:', error);
        toast({
          title: "Error loading conversation",
          description: "Please try again later."
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversationDetails();
    
    // Subscribe to changes in the conversation
    const conversationChannel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`
        },
        (payload) => {
          const newData = payload.new as any;
          // If this user deleted the conversation, redirect
          if (newData && newData.deleted_by === sessionUser.id) {
            navigate('/');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationChannel);
    };
  }, [conversationId, sessionUser, toast, navigate]);

  return { conversationDetails, isLoading };
}
