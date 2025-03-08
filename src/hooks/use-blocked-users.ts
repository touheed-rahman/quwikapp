
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
        const { data, error } = await supabase
          .from('blocked_users')
          .select('blocked_id')
          .eq('blocker_id', userId);

        if (error) throw error;
        
        setBlockedUsers(data?.map(item => item.blocked_id) || []);
      } catch (error: any) {
        console.error('Error fetching blocked users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockedUsers();
    
    // Subscribe to changes in blocked users
    const channel = supabase
      .channel(`blocked-users-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'blocked_users',
          filter: `blocker_id=eq.${userId}`,
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

  const blockUser = async (blockedId: string) => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: userId,
          blocked_id: blockedId
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
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', userId)
        .eq('blocked_id', blockedId);

      if (error) throw error;
      
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
    isBlocked: (userId: string) => blockedUsers.includes(userId)
  };
}
