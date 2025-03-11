
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Conversation } from '@/components/chat/types/conversation';

export function useConversations(
  filter: 'all' | 'buying' | 'selling',
  userId: string | null,
  isAuthenticated: boolean | null
) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchConversations = useCallback(async () => {
    try {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      let query = supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(id, title, price),
          seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url),
          buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url)
        `)
        .eq('deleted', false) // Only show non-deleted conversations
        .order('last_message_at', { ascending: false });

      if (filter === 'buying') {
        query = query.eq('buyer_id', userId);
      } else if (filter === 'selling') {
        query = query.eq('seller_id', userId);
      } else {
        query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setConversations(data || []);
      
      // Fetch unread counts for each conversation
      if (data && data.length > 0) {
        const { data: notifications, error: notificationsError } = await supabase
          .from('notifications')
          .select('conversation_id, unread_count')
          .eq('user_id', userId);
          
        if (notificationsError) throw notificationsError;
        
        if (notifications) {
          const counts: Record<string, number> = {};
          notifications.forEach(notification => {
            counts[notification.conversation_id] = notification.unread_count || 0;
          });
          setUnreadCounts(counts);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filter, userId]);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchConversations();
      
      // Subscribe to changes in conversations
      const conversationsChannel = supabase
        .channel(`user-conversations-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations',
            filter: `buyer_id=eq.${userId}`,
          },
          (payload) => {
            // If the conversation was deleted, remove it from state
            if (payload.new && (payload.new as any).deleted) {
              setConversations(prev => prev.filter(conv => conv.id !== (payload.new as any).id));
            } else {
              fetchConversations();
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations',
            filter: `seller_id=eq.${userId}`,
          },
          (payload) => {
            // If the conversation was deleted, remove it from state
            if (payload.new && (payload.new as any).deleted) {
              setConversations(prev => prev.filter(conv => conv.id !== (payload.new as any).id));
            } else {
              fetchConversations();
            }
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
            fetchConversations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(conversationsChannel);
        supabase.removeChannel(notificationsChannel);
      };
    }
  }, [filter, isAuthenticated, userId, fetchConversations]);

  const handleDelete = async (conversationId: string) => {
    try {
      // Mark the conversation as deleted
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ deleted: true })
        .eq('id', conversationId);
        
      if (updateError) {
        throw updateError;
      }

      // Remove the deleted conversation from the state immediately
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      toast({
        title: "Chat deleted",
        description: "The conversation has been permanently deleted.",
      });
      
      // If we're currently viewing this conversation, redirect to home
      if (window.location.pathname.includes(`/chat/${conversationId}`)) {
        navigate('/');
      }
      
      return true;
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the conversation.",
      });
      return false;
    }
  };

  return {
    conversations,
    isLoading,
    unreadCounts,
    handleDelete,
    fetchConversations
  };
}
