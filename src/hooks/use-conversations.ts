
import { useState, useEffect } from 'react';
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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchConversations();
    }
  }, [filter, isAuthenticated, userId]);

  const fetchConversations = async () => {
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
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (conversationId: string) => {
    try {
      // Instead of actually deleting the conversation, we'll mark it as deleted
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ deleted: true })
        .eq('id', conversationId);
        
      if (updateError) {
        throw updateError;
      }

      // Update the UI by removing the deleted conversation
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
    handleDelete,
    fetchConversations
  };
}
