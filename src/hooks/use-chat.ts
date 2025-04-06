
import { useSessionUser } from './use-session-user';
import { useConversationDetails } from './use-conversation-details';
import { useMessageList } from './use-message-list';
import { useMessageSender } from './use-message-sender';
import { useChatNotifications } from './use-chat-notifications';
import { useListingStatus } from './use-listing-status';
import { useEffect, useState } from 'react';
import { useTypingIndicator } from './chat/use-typing-indicator';
import { useReadReceipts } from './chat/use-read-receipts';
import { useChat as useChatContext } from '@/contexts/ChatContext';
import { supabase } from '@/integrations/supabase/client';

export function useChat(conversationId: string | undefined) {
  const { sessionUser, loading } = useSessionUser(conversationId);
  const { conversationDetails, isLoading: conversationLoading } = useConversationDetails(conversationId, sessionUser);
  const { messages, isLoading: messagesLoading } = useMessageList(conversationId, sessionUser?.id);
  const { newMessage, setNewMessage, handleSend, handleImageUpload } = useMessageSender(conversationId, sessionUser?.id);
  const { typing, setTypingStatus, markAsRead } = useChatContext();
  const { isTyping, typingUser } = useTypingIndicator(conversationId, sessionUser?.id);
  const { readMessages } = useReadReceipts(conversationId, sessionUser?.id, messages);
  const [userLastOnline, setUserLastOnline] = useState<string | null>(null);
  
  // Only call useListingStatus if we have a listing id
  const { isDisabled, disabledReason } = useListingStatus(conversationDetails?.listing?.id);
  
  useChatNotifications(conversationId, sessionUser?.id);

  // Mark conversation as read when viewing it
  useEffect(() => {
    if (!messagesLoading && conversationId && sessionUser?.id) {
      markAsRead(conversationId, sessionUser.id);
    }
  }, [conversationId, sessionUser?.id, messagesLoading, markAsRead]);

  // Handle typing indicator
  useEffect(() => {
    if (conversationId && newMessage.length > 0) {
      setTypingStatus(conversationId, true);
      
      // Clear typing status after 3 seconds of inactivity
      const timeout = setTimeout(() => {
        setTypingStatus(conversationId, false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    } else if (conversationId) {
      setTypingStatus(conversationId, false);
    }
  }, [conversationId, newMessage, setTypingStatus]);

  // Fetch other user's last online status
  useEffect(() => {
    if (!conversationDetails || !sessionUser) return;
    
    const otherUserId = sessionUser.id === conversationDetails.buyer_id 
      ? conversationDetails.seller_id 
      : conversationDetails.buyer_id;
      
    const fetchLastOnline = async () => {
      const { data, error } = await supabase
        .from('user_status')
        .select('last_online')
        .eq('user_id', otherUserId)
        .single();
        
      if (!error && data) {
        setUserLastOnline(data.last_online);
      }
    };
    
    fetchLastOnline();
    
    // Subscribe to status changes
    const statusChannel = supabase
      .channel(`user_status:${otherUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_status',
          filter: `user_id=eq.${otherUserId}`
        },
        (payload) => {
          if (payload.new) {
            setUserLastOnline(payload.new.last_online);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(statusChannel);
    };
  }, [conversationDetails, sessionUser]);

  return {
    messages,
    isLoading: loading || messagesLoading || conversationLoading,
    sessionUser,
    conversationDetails,
    newMessage,
    setNewMessage,
    handleSend,
    handleImageUpload,
    chatDisabled: isDisabled,
    disabledReason,
    isTyping,
    typingUser,
    readMessages,
    userLastOnline
  };
}
