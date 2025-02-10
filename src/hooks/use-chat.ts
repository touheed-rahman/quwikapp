
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { Message, ConversationDetails } from '@/components/chat/types/chat-detail';

export function useChat(conversationId: string | undefined) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [conversationDetails, setConversationDetails] = useState<ConversationDetails | null>(null);
  const [newMessage, setNewMessage] = useState("");

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

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching messages",
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversationDetails();
    fetchMessages();

    const markMessagesAsRead = async () => {
      try {
        await supabase
          .from('notifications')
          .update({ unread_count: 0 })
          .eq('conversation_id', conversationId)
          .eq('user_id', sessionUser.id);
      } catch (error: any) {
        console.error('Error marking messages as read:', error);
      }
    };

    markMessagesAsRead();

    const channel = supabase
      .channel(`room:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages(prev => [...prev, payload.new as Message]);
          
          if (payload.new.sender_id !== sessionUser.id) {
            markMessagesAsRead();
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, sessionUser, toast, navigate]);

  const handleSend = async () => {
    if (!newMessage.trim() || !sessionUser || !conversationId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: sessionUser.id,
          content: newMessage
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message
      });
    }
  };

  return {
    messages,
    isLoading,
    sessionUser,
    conversationDetails,
    newMessage,
    setNewMessage,
    handleSend
  };
}
