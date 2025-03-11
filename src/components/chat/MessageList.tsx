
import { Message } from "@/components/chat/types/chat-detail";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Image } from "lucide-react";

export interface MessageListProps {
  messages: Message[];
  sessionUserId?: string;
  unreadMessages?: Message[];
}

export const MessageList = ({ 
  messages, 
  sessionUserId, 
  unreadMessages = [] 
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isUnread = (message: Message) => {
    return unreadMessages.some(unread => unread.id === message.id);
  };

  const renderMessageContent = (message: Message) => {
    // Check if it's an image message
    if (message.is_image) {
      const imageUrl = message.content.match(/\[Image\]\((.*?)\)/)?.[1];
      
      if (imageUrl) {
        return (
          <div className="relative">
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              <img 
                src={imageUrl} 
                alt="Shared image" 
                className="rounded-md max-w-full max-h-60 object-contain cursor-pointer hover:opacity-90 transition-opacity"
              />
            </a>
          </div>
        );
      }
    }
    
    // Regular text message
    return message.content;
  };

  return (
    <div className="flex-1 space-y-4 p-4 overflow-y-auto">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === sessionUserId;
        const unread = isUnread(message);

        return (
          <div
            key={message.id}
            className={cn(
              "flex",
              isCurrentUser ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "relative max-w-[80%] rounded-lg px-3 py-2 text-sm",
                isCurrentUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
                unread && "font-bold"
              )}
            >
              {renderMessageContent(message)}
              {unread && (
                <div className="absolute -left-2 -top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
