
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/components/chat/types/chat-detail';
import { useToast } from '@/hooks/use-toast';

interface ChatContextType {
  typing: Record<string, boolean>;
  setTypingStatus: (conversationId: string, isTyping: boolean) => void;
  markAsRead: (conversationId: string, userId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  // Set typing status for a conversation
  const setTypingStatus = (conversationId: string, isTyping: boolean) => {
    setTyping(prev => ({
      ...prev,
      [conversationId]: isTyping
    }));
    
    if (conversationId) {
      // Broadcast typing status via Supabase presence
      try {
        const channel = supabase.channel(`typing:${conversationId}`);
        if (isTyping) {
          channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              await channel.track({
                isTyping,
                timestamp: new Date().toISOString()
              });
            }
          });
        } else {
          supabase.removeChannel(channel);
        }
      } catch (error) {
        console.error('Error setting typing status:', error);
      }
    }
  };

  // Mark a conversation as read
  const markAsRead = async (conversationId: string, userId: string) => {
    if (!conversationId || !userId) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .upsert(
          { 
            user_id: userId, 
            conversation_id: conversationId, 
            unread_count: 0 
          },
          { onConflict: 'user_id,conversation_id' }
        );
        
      if (error) {
        console.error('Error marking conversation as read:', error);
      }
    } catch (err) {
      console.error('Exception when marking conversation as read:', err);
      toast({
        title: "Error",
        description: "Failed to mark conversation as read",
        variant: "destructive",
      });
    }
  };
  
  const value = {
    typing,
    setTypingStatus,
    markAsRead,
  };
  
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
