
import { useSessionUser } from './use-session-user';
import { useConversationDetails } from './use-conversation-details';
import { useMessageList } from './use-message-list';
import { useMessageSender } from './use-message-sender';
import { useChatNotifications } from './use-chat-notifications';
import { useListingStatus } from './use-listing-status';

export function useChat(conversationId: string | undefined) {
  const { sessionUser, loading } = useSessionUser(conversationId);
  const { conversationDetails, isLoading: conversationLoading } = useConversationDetails(conversationId, sessionUser);
  const { messages, isLoading: messagesLoading } = useMessageList(conversationId, sessionUser?.id);
  const { newMessage, setNewMessage, handleSend, handleImageUpload } = useMessageSender(conversationId, sessionUser?.id);
  
  // Only call useListingStatus if we have a listing id
  const { isDisabled, disabledReason } = useListingStatus(conversationDetails?.listing?.id);
  
  useChatNotifications(conversationId, sessionUser?.id);

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
