
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import type { Message, ConversationDetails } from "@/components/chat/types/chat-detail";

const ChatDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [conversationDetails, setConversationDetails] = useState<ConversationDetails | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (id) {
          localStorage.setItem('intended_conversation', id);
        }
        navigate('/profile');
        return;
      }
      setSessionUser(session.user);
    };
    getSession();
  }, [navigate, id]);

  useEffect(() => {
    if (!id || !sessionUser) return;

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
          .eq('id', id)
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
          .eq('conversation_id', id)
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
          .eq('conversation_id', id)
          .eq('user_id', sessionUser.id);
      } catch (error: any) {
        console.error('Error marking messages as read:', error);
      }
    };

    markMessagesAsRead();

    const channel = supabase
      .channel(`room:${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${id}`
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
  }, [id, sessionUser, toast, navigate]);

  const handleSend = async () => {
    if (!newMessage.trim() || !sessionUser || !id) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: id,
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

  if (!sessionUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <p className="text-lg mb-4">Please sign in to view this chat</p>
        <Button onClick={() => navigate('/profile')}>Sign In</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <ChatDetailHeader conversationDetails={conversationDetails} />
      <MessageList messages={messages} sessionUserId={sessionUser.id} />
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
      />
    </div>
  );
};

export default ChatDetail;

