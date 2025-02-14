
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useMessageSender(conversationId: string | undefined, sessionUserId: string | undefined) {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");

  const handleSend = async (isInitialMessage?: boolean, offerAmount?: number) => {
    let messageContent = newMessage;

    // Only send "is this available" if it's the buyer's first message
    if (isInitialMessage) {
      const { data: conversation } = await supabase
        .from('conversations')
        .select('buyer_id')
        .eq('id', conversationId)
        .single();

      // Only send "is this available" if the current user is the buyer
      if (conversation && conversation.buyer_id === sessionUserId) {
        messageContent = "Hi, is this still available?";
      }
    } else if (offerAmount !== undefined) {
      messageContent = `I would like to make an offer of ₹${offerAmount.toLocaleString()}`;
    }

    if (!messageContent.trim() || !sessionUserId || !conversationId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: sessionUserId,
          content: messageContent,
          is_offer: offerAmount !== undefined
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message
      });
    }
  };

  return { newMessage, setNewMessage, handleSend };
}
