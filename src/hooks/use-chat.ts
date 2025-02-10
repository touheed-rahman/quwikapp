
import { useSessionUser } from './use-session-user';
import { useConversationDetails } from './use-conversation-details';
import { useMessageList } from './use-message-list';
import { useMessageSender } from './use-message-sender';
import { useChatNotifications } from './use-chat-notifications';

export function useChat(conversationId: string | undefined) {
  const sessionUser = useSessionUser(conversationId);
  const conversationDetails = useConversationDetails(conversationId, sessionUser);
  const { messages, isLoading } = useMessageList(conversationId, sessionUser?.id);
  const { newMessage, setNewMessage, handleSend } = useMessageSender(conversationId, sessionUser?.id);
  
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
