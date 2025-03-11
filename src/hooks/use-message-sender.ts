
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useMessageSender(conversationId: string | undefined, sessionUserId: string | undefined) {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");

  const handleSend = async (isInitialMessage?: boolean, offerAmount?: number) => {
    let messageContent = newMessage;

    if (offerAmount !== undefined) {
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

  const handleImageUpload = async (imageUrl: string) => {
    if (!sessionUserId || !conversationId) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: sessionUserId,
          content: `[Image](${imageUrl})`,
          is_image: true
        });

      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error sending image",
        description: error.message
      });
    }
  };

  return { newMessage, setNewMessage, handleSend, handleImageUpload };
}
