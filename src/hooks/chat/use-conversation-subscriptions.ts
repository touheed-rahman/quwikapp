
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useConversationSubscriptions(
  userId: string | null,
  fetchConversations: () => void
) {
  useEffect(() => {
    if (!userId) return;
    
    // Set up subscriptions for real-time updates
    const conversationsChannel = supabase
      .channel(`user-conversations-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `buyer_id=eq.${userId}`,
        },
        () => {
          console.log('Conversation changed (buyer)');
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `seller_id=eq.${userId}`,
        },
        () => {
          console.log('Conversation changed (seller)');
          fetchConversations();
        }
      )
      .subscribe();
      
    // Subscribe to notifications changes
    const notificationsChannel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          console.log('Notification changed');
          fetchConversations();
        }
      )
      .subscribe();

    // Subscribe to messages changes
    const messagesChannel = supabase
      .channel(`user-messages-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        () => {
          console.log('New message received');
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [userId, fetchConversations]);
}
