
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useTextMessage(conversationId: string | undefined, userId: string | undefined) {
  const { toast } = useToast();

  const sendTextMessage = async (content: string, isOffer: boolean = false) => {
    try {
      if (!conversationId || !userId || !content.trim()) {
        console.log('Missing data for message:', { conversationId, userId, contentLength: content?.length });
        return false;
      }

      console.log('Sending message in conversation:', conversationId);

      // Insert the message
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
          title: "Message not sent",
          description: "Please try again."
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
        // Don't show toast here, message was sent successfully
      }

      return true;
    } catch (error) {
      console.error('Error in sendTextMessage:', error);
      toast({
        title: "Message failed",
        description: "There was a problem sending your message."
      });
      return false;
    }
  };

  return {
    sendTextMessage
  };
}
