
import { useState } from 'react';
import { useTextMessage } from './chat/use-text-message';
import { useImageMessage } from './chat/use-image-message';
import { useToast } from './use-toast';

export function useMessageSender(conversationId: string | undefined, userId: string | undefined) {
  const [newMessage, setNewMessage] = useState('');
  const { sendTextMessage } = useTextMessage(conversationId, userId);
  const { sendImageMessage } = useImageMessage(conversationId, userId);
  const { toast } = useToast();

  const handleSend = async (isOffer: boolean = false) => {
    if (!newMessage.trim()) {
      return;
    }

    try {
      const success = await sendTextMessage(newMessage, isOffer);
      if (success) {
        // Clear the input only if the message was sent successfully
        setNewMessage('');
      } else {
        toast({
          title: "Failed to send",
          description: "Your message couldn't be sent. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    try {
      await sendImageMessage(imageUrl);
    } catch (error) {
      console.error("Error sending image:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your image",
        variant: "destructive"
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
