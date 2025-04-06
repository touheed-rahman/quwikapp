
import { MessageList } from "@/components/chat/MessageList";
import QuickMessageSuggestions from "@/components/chat/QuickMessageSuggestions";
import ChatInput from "@/components/chat/ChatInput";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";
import ChatTipBox from "@/components/chat/ChatTipBox";
import { ConversationDetails, Message } from "@/components/chat/types/chat-detail";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";

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
  isTyping?: boolean;
  typingUser?: string | null;
  readMessages?: Record<string, boolean>;
  userLastOnline?: string | null;
  isSending?: boolean;
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
  isTyping = false,
  typingUser = null,
  readMessages = {},
  userLastOnline = null,
  isSending = false
}: ChatMainViewProps) => {
  const [lastSeenText, setLastSeenText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleQuickMessage = (message: string) => {
    setNewMessage(message);
    // Automatically send the message after selecting it
    setTimeout(() => handleSend(), 50);
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Format the last online time
  useEffect(() => {
    if (!userLastOnline || isOtherUserOnline) {
      setLastSeenText(null);
      return;
    }
    
    try {
      const lastOnlineDate = new Date(userLastOnline);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - lastOnlineDate.getTime()) / (1000 * 60));
      
      if (diffMinutes < 1) {
        setLastSeenText("Just now");
      } else if (diffMinutes < 60) {
        setLastSeenText(`${diffMinutes} min ago`);
      } else {
        setLastSeenText(`Last seen ${format(lastOnlineDate, "h:mm a")}`);
      }
    } catch (error) {
      console.error("Error formatting last online time:", error);
      setLastSeenText(null);
    }
  }, [userLastOnline, isOtherUserOnline]);

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
        lastSeen={lastSeenText}
        sessionUserId={sessionUserId}
      />
      
      <div className="flex-1 overflow-y-auto">
        <MessageList 
          messages={messages} 
          sessionUserId={sessionUserId} 
          readMessages={readMessages}
        />
        
        {isTyping && typingUser && (
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary animate-bounce rounded-full" />
              <div className="w-2 h-2 bg-primary animate-bounce rounded-full ml-0.5" 
                   style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-primary animate-bounce rounded-full ml-0.5" 
                   style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-xs text-muted-foreground">Typing...</span>
          </div>
        )}
        
        {isEmptyChat && isBuyer && <ChatTipBox />}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="mt-auto">
        <QuickMessageSuggestions 
          onSendQuickMessage={handleQuickMessage} 
          isBuyer={isBuyer}
        />
      
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSend={handleSend}
          disabled={chatDisabled || isSending}
          disabledReason={disabledReason}
          onImageUpload={onImageUpload}
          isTyping={isTyping}
          isSending={isSending}
        />
      </div>
    </motion.div>
  );
};

export default ChatMainView;
