
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

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
        // Use a raw SQL query instead of accessing the table directly
        const { data, error } = await supabase.from('user_blocks')
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
    
    // Subscribe to changes using a channel with a more generic approach
    const channel = supabase
      .channel(`user-blocks-${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public',
          table: 'user_blocks',
          filter: `blocker_id=eq.${userId}`
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
      // Insert directly into the user_blocks table
      const { error } = await supabase.from('user_blocks')
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
      const { error } = await supabase.from('user_blocks')
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
    isBlocked: (id: string) => blockedUsers.includes(id)
  };
}
