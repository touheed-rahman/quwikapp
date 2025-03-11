
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useImageMessage(conversationId: string | undefined, userId: string | undefined) {
  const { toast } = useToast();

  const sendImageMessage = async (imageUrl: string) => {
    try {
      if (!conversationId || !userId || !imageUrl) {
        console.log('Missing data for image message:', { conversationId, userId, hasImageUrl: !!imageUrl });
        return false;
      }

      console.log('Sending image in conversation:', conversationId);

      // Insert the image message
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
          title: "Image not sent",
          description: "Please try again."
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
        console.error('Error updating conversation after image:', updateError);
        // Don't show toast here, image was sent successfully
      }

      return true;
    } catch (error) {
      console.error('Error in sendImageMessage:', error);
      toast({
        title: "Image failed",
        description: "There was a problem sending your image."
      });
      return false;
    }
  };

  return {
    sendImageMessage
  };
}
