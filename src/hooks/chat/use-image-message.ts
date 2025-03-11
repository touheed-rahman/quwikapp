
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useImageMessage(conversationId: string | undefined, userId: string | undefined) {
  const { toast } = useToast();

  const sendImageMessage = async (imageUrl: string) => {
    try {
      if (!conversationId || !userId || !imageUrl) {
        return false;
      }

      // Insert the image message without trying to determine the recipient
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          content: imageUrl,
          is_image: true
        });

      if (msgError) {
        console.error('Error sending image message:', msgError);
        toast({
          variant: "destructive",
          title: "Failed to send image",
          description: "There was an error sending your image. Please try again."
        });
        return false;
      }

      // Update the conversation's last_message and last_message_at
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          last_message: "📷 Image",
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (updateError) {
        console.error('Error updating conversation:', updateError);
      }

      return true;
    } catch (error) {
      console.error('Error in sendImageMessage:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send image"
      });
      return false;
    }
  };

  return {
    sendImageMessage
  };
}
