
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TypingPresence } from '@/types/database.types';

export function useTypingIndicator(conversationId: string | undefined, userId: string | undefined) {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  
  useEffect(() => {
    if (!conversationId || !userId) return;
    
    // Subscribe to typing indicator channel
    const channel = supabase.channel(`typing:${conversationId}`);
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Check if anyone other than the current user is typing
        const typingUsers = Object.entries(state)
          .filter(([key, presence]) => {
            // Extract user ID from the presence key
            const presenceUserId = key.split(':')[0];
            // Only include other users who are typing
            return presenceUserId !== userId && 
                  Array.isArray(presence) && 
                  presence.length > 0 && 
                  presence[0] && (presence[0] as unknown as TypingPresence).isTyping;
          });
        
        if (typingUsers.length > 0) {
          setIsTyping(true);
          // Get the user ID of the person typing
          const typingUserId = typingUsers[0][0].split(':')[0];
          setTypingUser(typingUserId);
        } else {
          setIsTyping(false);
          setTypingUser(null);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId]);

  return { isTyping, typingUser };
}
