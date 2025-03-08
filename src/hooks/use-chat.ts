
import { useSessionUser } from './use-session-user';
import { useConversationDetails } from './use-conversation-details';
import { useMessageList } from './use-message-list';
import { useMessageSender } from './use-message-sender';
import { useChatNotifications } from './use-chat-notifications';
import { useListingStatus } from './use-listing-status';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export function useChat(conversationId: string | undefined) {
  const { sessionUser, loading: userLoading } = useSessionUser(conversationId);
  const conversationDetails = useConversationDetails(conversationId, sessionUser);
  const { messages, isLoading: messagesLoading } = useMessageList(conversationId, sessionUser?.id);
  const { newMessage, setNewMessage, handleSend } = useMessageSender(conversationId, sessionUser?.id);
  const { isDisabled, disabledReason } = useListingStatus(conversationDetails?.listing?.id);
  const [isBlocked, setIsBlocked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useChatNotifications(conversationId, sessionUser?.id);

  // Check if the current user is blocked
  useEffect(() => {
    if (!sessionUser || !conversationDetails) return;
    
    const checkBlockStatus = async () => {
      // Determine the other user
      const otherUserId = sessionUser.id === conversationDetails.buyer_id 
        ? conversationDetails.seller_id 
        : conversationDetails.buyer_id;
      
      const { data, error } = await supabase
        .from('blocked_users')
        .select('*')
        .or(`and(blocker_id.eq.${otherUserId},blocked_id.eq.${sessionUser.id}),and(blocker_id.eq.${sessionUser.id},blocked_id.eq.${otherUserId})`)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking block status:', error);
        return;
      }
      
      // If a block record exists
      if (data) {
        setIsBlocked(true);
        
        // If this user was blocked by the other user, show a message and redirect
        if (data.blocker_id === otherUserId && data.blocked_id === sessionUser.id) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You have been blocked by this user."
          });
          navigate('/chat');
        }
      }
    };
    
    checkBlockStatus();
  }, [sessionUser, conversationDetails, toast, navigate]);

  return {
    messages,
    isLoading: userLoading || messagesLoading,
    sessionUser,
    conversationDetails,
    newMessage,
    setNewMessage,
    handleSend,
    chatDisabled: isDisabled || isBlocked,
    disabledReason: isBlocked ? "This conversation is no longer available." : disabledReason
  };
}
