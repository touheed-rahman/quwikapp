
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/components/chat/types/chat-detail';

export function useReadReceipts(
  conversationId: string | undefined, 
  sessionUserId: string | undefined,
  messages: Message[]
) {
  const [readMessages, setReadMessages] = useState<Record<string, boolean>>({});
  const [lastReadTimestamp, setLastReadTimestamp] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId || !sessionUserId || messages.length === 0) return;

    const fetchReadReceipts = async () => {
      try {
        const { data, error } = await supabase
          .from('read_receipts')
          .select('*')
          .eq('conversation_id', conversationId)
          .neq('user_id', sessionUserId);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Get the most recent read receipt timestamp
          const lastReceipt = data[0];
          setLastReadTimestamp(lastReceipt.read_at);
          
          // Mark messages as read
          const readStatus: Record<string, boolean> = {};
          messages.forEach(message => {
            // If the message was sent by the current user and created before the last read receipt
            if (message.sender_id === sessionUserId && 
                message.created_at <= lastReceipt.read_at) {
              readStatus[message.id] = true;
            } else {
              readStatus[message.id] = false;
            }
          });
          
          setReadMessages(readStatus);
        }
      } catch (error) {
        console.error('Error fetching read receipts:', error);
      }
    };
    
    fetchReadReceipts();
    
    // Subscribe to read receipt changes
    const channel = supabase
      .channel(`read_receipts:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'read_receipts',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          // Update read receipts when they change
          const { new: newReceipt } = payload;
          if (newReceipt && newReceipt.user_id !== sessionUserId) {
            setLastReadTimestamp(newReceipt.read_at);
            
            // Update read status for messages
            setReadMessages(prev => {
              const updated = { ...prev };
              messages.forEach(message => {
                if (message.sender_id === sessionUserId && 
                    message.created_at <= newReceipt.read_at) {
                  updated[message.id] = true;
                }
              });
              return updated;
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, sessionUserId, messages]);

  // Update read receipt when the user views messages
  useEffect(() => {
    if (!conversationId || !sessionUserId || messages.length === 0) return;
    
    const updateReadReceipt = async () => {
      try {
        const latestMessage = messages[messages.length - 1];
        
        await supabase
          .from('read_receipts')
          .upsert({
            conversation_id: conversationId,
            user_id: sessionUserId,
            read_at: new Date().toISOString(),
            last_read_message_id: latestMessage.id
          }, {
            onConflict: 'conversation_id,user_id'
          });
      } catch (error) {
        console.error('Error updating read receipt:', error);
      }
    };
    
    updateReadReceipt();
  }, [conversationId, sessionUserId, messages]);

  return { readMessages, lastReadTimestamp };
}
