
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useChatNotifications(conversationId: string | undefined, sessionUserId: string | undefined) {
  useEffect(() => {
    if (!conversationId || !sessionUserId) return;

    const markMessagesAsRead = async () => {
      try {
        await supabase
          .from('notifications')
          .update({ unread_count: 0 })
          .eq('conversation_id', conversationId)
          .eq('user_id', sessionUserId);
      } catch (error: any) {
        console.error('Error marking messages as read:', error);
      }
    };

    markMessagesAsRead();
  }, [conversationId, sessionUserId]);
}
