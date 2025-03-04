
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// This hook tracks which users are currently online
export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Set up presence channel for tracking online users
    const channel = supabase.channel('online-users')
      
      // When a user's presence state syncs
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const online = new Set<string>();
        
        // Extract user IDs from the presence state
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.user_id) {
              online.add(presence.user_id);
            }
          });
        });
        
        setOnlineUsers(online);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;
        
        // Get the current user's ID
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        
        if (user) {
          // Track this user as online
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
        }
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return { onlineUsers };
}
