
import { useState } from 'react';
import { useTextMessage } from './chat/use-text-message';
import { useImageMessage } from './chat/use-image-message';

export function useMessageSender(conversationId: string | undefined, userId: string | undefined) {
  const [newMessage, setNewMessage] = useState('');
  const { sendTextMessage } = useTextMessage(conversationId, userId);
  const { sendImageMessage } = useImageMessage(conversationId, userId);

  const handleSend = async (isOffer: boolean = false) => {
    if (await sendTextMessage(newMessage, isOffer)) {
      // Clear the input only if the message was sent successfully
      setNewMessage('');
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    await sendImageMessage(imageUrl);
  };

  return {
    newMessage,
    setNewMessage,
    handleSend,
    handleImageUpload
  };
}
