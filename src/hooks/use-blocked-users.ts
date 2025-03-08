
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useBlockedUsers(userId: string | undefined) {
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchBlockedUsers = async () => {
      try {
        // Find all block messages sent by this user
        const { data, error } = await supabase
          .from('messages')
          .select('content, id')
          .eq('sender_id', userId)
          .eq('is_block_message', true);

        if (error) throw error;
        
        // Extract blocked user IDs from the content
        // Format is "User X has blocked user Y"
        const blockedIds = data?.map(item => {
          const match = item.content.match(/has blocked user (\S+)/);
          return match ? match[1] : null;
        }).filter(Boolean) || [];
        
        setBlockedUsers(blockedIds as string[]);
      } catch (error: any) {
        console.error('Error fetching blocked users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockedUsers();
    
    // Subscribe to changes in messages with is_block_message flag
    const channel = supabase
      .channel(`block-messages-${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId} AND is_block_message=eq.true`
        }, 
        () => {
          fetchBlockedUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const blockUser = async (blockedId: string, conversationId: string) => {
    if (!userId) return false;
    
    try {
      // Add a system message to indicate blocking
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          content: `User ${userId} has blocked user ${blockedId}`,
          is_system_message: true,
          is_block_message: true,
          conversation_id: conversationId
        });

      if (error) throw error;
      
      toast({
        title: "User blocked",
        description: "You will no longer receive messages from this user"
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to block user",
        description: error.message
      });
      return false;
    }
  };

  const unblockUser = async (blockedId: string) => {
    if (!userId) return false;
    
    try {
      // Find and delete the block message
      const { data, error: findError } = await supabase
        .from('messages')
        .select('id')
        .eq('sender_id', userId)
        .eq('is_block_message', true)
        .like('content', `%has blocked user ${blockedId}%`);
      
      if (findError) throw findError;
      
      if (data && data.length > 0) {
        // Delete the block message(s)
        const deleteResult = await supabase
          .from('messages')
          .delete()
          .in('id', data.map(msg => msg.id));
        
        if (deleteResult.error) throw deleteResult.error;
      }
      
      toast({
        title: "User unblocked",
        description: "You can now receive messages from this user again"
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to unblock user",
        description: error.message
      });
      return false;
    }
  };

  return {
    blockedUsers,
    isLoading,
    blockUser,
    unblockUser,
    isBlocked: (id: string) => blockedUsers.includes(id)
  };
}
