
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Conversation } from '@/components/chat/types/conversation';

export function useConversationFetch(
  filter: 'all' | 'buying' | 'selling',
  userId: string | null
) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const fetchConversations = useCallback(async () => {
    try {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      console.log('Fetching conversations for user:', userId);
      setIsLoading(true);

      // Create query for conversations
      let query = supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(id, title, price),
          seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url),
          buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url)
        `)
        .or(`deleted_by.is.null,and(deleted_by.neq.${userId})`); // Don't include conversations deleted by this user

      // Apply filter
      if (filter === 'buying') {
        query = query.eq('buyer_id', userId);
      } else if (filter === 'selling') {
        query = query.eq('seller_id', userId);
      } else {
        query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
      }

      // Order by most recent message
      query = query.order('last_message_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }
      
      console.log('Fetched conversations count:', data?.length || 0);
      
      if (data) {
        // Filter out conversations without required data and not deleted by current user
        const validConversations = data.filter(conv => 
          conv.listing && 
          conv.buyer && 
          conv.seller &&
          (conv.deleted_by === null || conv.deleted_by !== userId)
        );
        
        console.log('Valid conversations after filtering:', validConversations.length);
        
        // Update state with valid conversations
        setConversations(validConversations);
      } else {
        setConversations([]);
      }
      
      // Fetch unread counts for each conversation
      if (userId) {
        const { data: notifications, error: notificationsError } = await supabase
          .from('notifications')
          .select('conversation_id, unread_count')
          .eq('user_id', userId);
          
        if (notificationsError) {
          console.error('Error fetching notifications:', notificationsError);
        } else if (notifications) {
          const counts: Record<string, number> = {};
          notifications.forEach(notification => {
            counts[notification.conversation_id] = notification.unread_count || 0;
          });
          setUnreadCounts(counts);
          console.log('Unread counts:', counts);
        }
      }
    } catch (error) {
      console.error('Error in fetchConversations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load conversations"
      });
    } finally {
      setIsLoading(false);
    }
  }, [filter, userId, toast]);

  return {
    conversations,
    setConversations,
    isLoading,
    setIsLoading,
    unreadCounts,
    setUnreadCounts,
    fetchConversations
  };
}
