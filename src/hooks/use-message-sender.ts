
import { useState } from 'react';
import { useTextMessage } from './chat/use-text-message';
import { useImageMessage } from './chat/use-image-message';
import { useToast } from './use-toast';

export function useMessageSender(conversationId: string | undefined, userId: string | undefined) {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { sendTextMessage } = useTextMessage(conversationId, userId);
  const { sendImageMessage } = useImageMessage(conversationId, userId);
  const { toast } = useToast();

  const handleSend = async (isOffer: boolean = false) => {
    if (!newMessage.trim() || isSending) {
      return;
    }

    try {
      setIsSending(true);
      console.log("Attempting to send message:", newMessage);
      
      const messageToSend = newMessage; // Store message before clearing input
      setNewMessage(''); // Clear input immediately for better UX
      
      const success = await sendTextMessage(messageToSend, isOffer);
      
      if (!success) {
        // If sending failed, restore the message to the input
        setNewMessage(messageToSend);
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
    } finally {
      setIsSending(false);
    }
  };

  const sendQuickMessage = async (message: string) => {
    setNewMessage(message);
    await handleSend();
  };

  const handleImageUpload = async (imageUrl: string) => {
    try {
      setIsSending(true);
      await sendImageMessage(imageUrl);
    } catch (error) {
      console.error("Error sending image:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your image",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    newMessage,
    setNewMessage,
    handleSend,
    sendQuickMessage,
    handleImageUpload,
    isSending
  };
}
