
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
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

  // Initialize conversations when component mounts or filter/auth changes
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchConversations();
      
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
    }
  }, [filter, isAuthenticated, userId, fetchConversations]);

  const handleDelete = async (conversationId: string) => {
    try {
      if (isDeleting) return false;
      
      setIsDeleting(true);
      
      // Update the conversation record to mark it as deleted by this user
      const { error } = await supabase
        .from('conversations')
        .update({ 
          deleted_by: userId 
        })
        .eq('id', conversationId);
        
      if (error) {
        throw error;
      }

      // Remove the deleted conversation from the state immediately
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      toast({
        title: "Chat deleted",
        description: "The conversation has been removed from your chat list.",
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
    } finally {
      setIsDeleting(false);
    }
  };

  // Force a refresh of conversations
  const refreshConversations = useCallback(() => {
    if (isAuthenticated && userId) {
      console.log('Manually refreshing conversations');
      fetchConversations();
    }
  }, [isAuthenticated, userId, fetchConversations]);

  return {
    conversations,
    isLoading,
    unreadCounts,
    handleDelete,
    fetchConversations,
    refreshConversations,
    isDeleting
  };
}
