
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useImageMessage(conversationId: string | undefined, userId: string | undefined) {
  const { toast } = useToast();

  const sendImageMessage = async (imageUrl: string) => {
    try {
      if (!conversationId || !userId || !imageUrl) {
        return false;
      }

      // Get conversation details to determine the recipient
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('buyer_id, seller_id')
        .eq('id', conversationId)
        .single();

      if (convError) {
        console.error('Error fetching conversation:', convError);
        return false;
      }

      const receiverId = conversation.buyer_id === userId 
        ? conversation.seller_id 
        : conversation.buyer_id;

      // Insert the image message
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          receiver_id: receiverId,
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

      // Increment unread count for the recipient
      const { error: notifError } = await supabase
        .rpc('increment_unread_count', {
          p_conversation_id: conversationId,
          p_user_id: receiverId
        } as any); // Type assertion to fix the TypeScript error

      if (notifError) {
        console.error('Error updating notification count:', notifError);
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
