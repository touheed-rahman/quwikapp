
import { useSession } from './use-session-user';
import { useConversationDetails } from './use-conversation-details';
import { useMessageList } from './use-message-list';
import { useMessageSender } from './use-message-sender';
import { useChatNotifications } from './use-chat-notifications';
import { useListingStatus } from './use-listing-status';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useChat(conversationId: string | undefined) {
  const { user: sessionUser, loading } = useSession();
  const { conversationDetails, isLoading: conversationLoading } = useConversationDetails(conversationId, sessionUser);
  const { messages, isLoading: messagesLoading } = useMessageList(conversationId, sessionUser?.id);
  const { newMessage, setNewMessage, handleSend, handleImageUpload } = useMessageSender(conversationId, sessionUser?.id);
  
  // Only call useListingStatus if we have a listing id
  const { isDisabled, disabledReason } = useListingStatus(conversationDetails?.listing?.id);
  
  useChatNotifications(conversationId, sessionUser?.id);

  // Mark conversation as read when viewing it
  useEffect(() => {
    const markAsRead = async () => {
      if (conversationId && sessionUser?.id) {
        console.log('Marking conversation as read:', conversationId);
        try {
          // Update the unread count to 0 for this conversation
          const { error } = await supabase
            .from('notifications')
            .upsert(
              { 
                user_id: sessionUser.id, 
                conversation_id: conversationId, 
                unread_count: 0 
              },
              { onConflict: 'user_id,conversation_id' }
            );
            
          if (error) {
            console.error('Error marking conversation as read:', error);
          }
        } catch (err) {
          console.error('Exception when marking conversation as read:', err);
        }
      }
    };

    if (!messagesLoading && conversationId && sessionUser?.id) {
      markAsRead();
    }
  }, [conversationId, sessionUser?.id, messagesLoading]);

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
    disabledReason
  };
}
