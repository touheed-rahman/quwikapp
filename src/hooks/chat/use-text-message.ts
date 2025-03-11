
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useTextMessage(conversationId: string | undefined, userId: string | undefined) {
  const { toast } = useToast();

  const sendTextMessage = async (content: string, isOffer: boolean = false) => {
    try {
      if (!conversationId || !userId || !content.trim()) {
        return false;
      }

      // Insert the message without trying to determine the recipient
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          content: content,
          is_offer: isOffer
        });

      if (msgError) {
        console.error('Error sending message:', msgError);
        toast({
          variant: "destructive",
          title: "Failed to send message",
          description: "There was an error sending your message. Please try again."
        });
        return false;
      }

      // Update the conversation's last_message and last_message_at
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (updateError) {
        console.error('Error updating conversation:', updateError);
      }

      return true;
    } catch (error) {
      console.error('Error in sendTextMessage:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message"
      });
      return false;
    }
  };

  return {
    sendTextMessage
  };
}
