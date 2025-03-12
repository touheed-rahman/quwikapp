
import { MessageList } from "@/components/chat/MessageList";
import QuickMessageSuggestions from "@/components/chat/QuickMessageSuggestions";
import ChatInput from "@/components/chat/ChatInput";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";
import ChatTipBox from "@/components/chat/ChatTipBox";
import { ConversationDetails, Message } from "@/components/chat/types/chat-detail";
import { motion } from "framer-motion";

interface ChatMainViewProps {
  conversationDetails: ConversationDetails | null;
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSend: () => void;
  isOtherUserOnline: boolean;
  sessionUserId: string;
  isBuyer: boolean;
  chatDisabled: boolean;
  disabledReason: string;
  onBack: () => void;
  onImageUpload: (file: File) => Promise<void>;
  isEmptyChat: boolean;
  onDeleteChat?: () => void; // Added this prop definition
}

const ChatMainView = ({
  conversationDetails,
  messages,
  newMessage,
  setNewMessage,
  handleSend,
  isOtherUserOnline,
  sessionUserId,
  isBuyer,
  chatDisabled,
  disabledReason,
  onBack,
  onImageUpload,
  isEmptyChat,
  onDeleteChat
}: ChatMainViewProps) => {
  const handleQuickMessage = (message: string) => {
    setNewMessage(message);
    // Optional: automatically send the message
    // setTimeout(() => handleSend(), 100);
  };

  return (
    <motion.div 
      className="flex flex-col h-[100dvh] bg-gradient-to-b from-background to-primary/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ChatDetailHeader 
        conversationDetails={conversationDetails} 
        onBack={onBack}
        isOnline={isOtherUserOnline}
        sessionUserId={sessionUserId}
        onDeleteChat={onDeleteChat}
      />
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} sessionUserId={sessionUserId} />
        
        {isEmptyChat && isBuyer && <ChatTipBox />}
      </div>
      
      <QuickMessageSuggestions 
        onSendQuickMessage={handleQuickMessage} 
        isBuyer={isBuyer}
      />
      
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
        disabled={chatDisabled}
        disabledReason={disabledReason}
        onImageUpload={onImageUpload}
      />
    </motion.div>
  );
};

export default ChatMainView;

