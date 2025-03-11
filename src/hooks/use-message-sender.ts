
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useMessageSender(conversationId: string | undefined, userId: string | undefined) {
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  const handleSend = async (isOffer: boolean = false) => {
    try {
      if (!conversationId || !userId || !newMessage.trim()) {
        return;
      }

      // Get conversation details to determine the recipient
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('buyer_id, seller_id')
        .eq('id', conversationId)
        .single();

      if (convError) {
        console.error('Error fetching conversation:', convError);
        return;
      }

      const receiverId = conversation.buyer_id === userId 
        ? conversation.seller_id 
        : conversation.buyer_id;

      // Insert the message
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          receiver_id: receiverId,
          content: newMessage,
          is_offer: isOffer
        });

      if (msgError) {
        console.error('Error sending message:', msgError);
        toast({
          variant: "destructive",
          title: "Failed to send message",
          description: "There was an error sending your message. Please try again."
        });
        return;
      }

      // Update the conversation's last_message and last_message_at
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          last_message: newMessage,
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (updateError) {
        console.error('Error updating conversation:', updateError);
      }

      // Increment unread count for the recipient using rpc
      const { error: notifError } = await supabase
        .rpc('increment_unread_count', {
          p_conversation_id: conversationId,
          p_user_id: receiverId
        } as any); // Type assertion to fix the TypeScript error

      if (notifError) {
        console.error('Error updating notification count:', notifError);
      }

      // Clear the input
      setNewMessage('');
    } catch (error) {
      console.error('Error in handleSend:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message"
      });
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    try {
      if (!conversationId || !userId || !imageUrl) {
        return;
      }

      // Get conversation details to determine the recipient
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('buyer_id, seller_id')
        .eq('id', conversationId)
        .single();

      if (convError) {
        console.error('Error fetching conversation:', convError);
        return;
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
        return;
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
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send image"
      });
    }
  };

  return {
    newMessage,
    setNewMessage,
    handleSend,
    handleImageUpload
  };
}
