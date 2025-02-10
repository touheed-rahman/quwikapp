
import { useChatAuth } from './use-chat-auth';
import { useChatMessages } from './use-chat-messages';
import { useChatNotifications } from './use-chat-notifications';

export function useChat(conversationId: string | undefined) {
  const { sessionUser, conversationDetails } = useChatAuth(conversationId);
  const { messages, isLoading, newMessage, setNewMessage, handleSend } = 
    useChatMessages(conversationId, sessionUser?.id);
  
  useChatNotifications(conversationId, sessionUser?.id);

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
