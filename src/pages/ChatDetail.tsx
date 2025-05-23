
import { useNavigate, useParams } from "react-router-dom";
import { useChat } from "@/hooks/use-chat";
import { useOnlineUsers } from "@/hooks/use-online-users";
import { useImageUpload } from "@/hooks/use-image-upload";
import ChatMainView from "@/components/chat/ChatMainView";
import ChatSignInPrompt from "@/components/chat/ChatSignInPrompt";
import ChatLoadingState from "@/components/chat/ChatLoadingState";

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { onlineUsers } = useOnlineUsers();
  
  const {
    messages,
    isLoading,
    sessionUser,
    conversationDetails,
    newMessage,
    setNewMessage,
    handleSend,
    chatDisabled,
    disabledReason,
    handleImageUpload: handleImageUrlUpload
  } = useChat(id);

  // Create a wrapper function to handle type conversion
  const handleImageUpload = (file: File) => {
    if (!id || !sessionUser) return Promise.resolve();
    
    const { handleUploadImage } = useImageUpload(id, sessionUser.id, (url: string) => {
      // This is safe because we're just passing the string URL from the upload
      handleImageUrlUpload(url);
    });
    
    return handleUploadImage(file);
  };

  const handleBack = () => {
    navigate('/');
  };

  // Show sign-in prompt if user is not logged in
  if (!sessionUser) {
    return <ChatSignInPrompt />;
  }

  // Show loading state while data is being fetched
  if (isLoading) {
    return <ChatLoadingState />;
  }

  // Determine if the other user is online
  const otherUserId = conversationDetails 
    ? (sessionUser.id === conversationDetails.buyer_id 
      ? conversationDetails.seller_id 
      : conversationDetails.buyer_id)
    : null;
  
  const isOtherUserOnline = otherUserId ? onlineUsers.has(otherUserId) : false;
  
  // Determine if the current user is a buyer
  const isBuyer = conversationDetails && sessionUser.id === conversationDetails.buyer_id;
  
  // Check if this is an empty chat (no messages)
  const isEmptyChat = messages.length === 0;

  return (
    <ChatMainView
      conversationDetails={conversationDetails}
      messages={messages}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSend={handleSend}
      isOtherUserOnline={isOtherUserOnline}
      sessionUserId={sessionUser.id}
      isBuyer={isBuyer || false}
      chatDisabled={chatDisabled}
      disabledReason={disabledReason}
      onBack={handleBack}
      onImageUpload={handleImageUpload}
      isEmptyChat={isEmptyChat}
    />
  );
};

export default ChatDetail;
