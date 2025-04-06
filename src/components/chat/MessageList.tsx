
import { Message } from "@/components/chat/types/chat-detail";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

export interface MessageListProps {
  messages: Message[];
  sessionUserId?: string;
  unreadMessages?: Message[];
  readMessages?: Record<string, boolean>;
}

export const MessageList = ({ 
  messages, 
  sessionUserId, 
  unreadMessages = [],
  readMessages = {}
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [groupedMessages, setGroupedMessages] = useState<{date: string, messages: Message[]}[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Group messages by date
    const groups: {[key: string]: Message[]} = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at);
      let dateKey: string;
      
      if (isToday(date)) {
        dateKey = "Today";
      } else if (isYesterday(date)) {
        dateKey = "Yesterday";
      } else {
        dateKey = format(date, "MMMM d, yyyy");
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(message);
    });
    
    // Convert the groups object to an array
    const groupArray = Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
    
    setGroupedMessages(groupArray);
  }, [messages]);

  const isUnread = (message: Message) => {
    return unreadMessages.some(unread => unread.id === message.id);
  };

  const isMessageRead = (message: Message) => {
    return readMessages[message.id] || false;
  };

  const renderMessageContent = (message: Message) => {
    // Check if it's an image message
    if (message.is_image || (message.content.startsWith('[Image](') && message.content.includes(')'))) {
      const imageUrl = message.is_image ? message.content : message.content.match(/\[Image\]\((.*?)\)/)?.[1];
      
      if (imageUrl) {
        return (
          <div className="relative">
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              <img 
                src={imageUrl} 
                alt="Shared image" 
                className="rounded-md max-w-full max-h-60 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                onLoad={scrollToBottom}
              />
            </a>
          </div>
        );
      }
    }
    
    // Check if it's an offer message
    if (message.is_offer) {
      const amount = parseFloat(message.content);
      if (!isNaN(amount)) {
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-sm mb-1">Price Offer</span>
            <span className="text-lg font-bold">₹{amount.toLocaleString()}</span>
          </div>
        );
      }
    }
    
    // Regular text message
    return message.content;
  };
  
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "h:mm a");
  };

  return (
    <div className="flex-1 space-y-4 p-4 overflow-y-auto scrollbar-hide">
      {groupedMessages.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`}>
          <div className="text-center my-4">
            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
              {group.date}
            </span>
          </div>
          
          <div className="space-y-3">
            {group.messages.map((message) => {
              const isCurrentUser = message.sender_id === sessionUserId;
              const unread = isUnread(message);
              const read = isCurrentUser && isMessageRead(message);

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={cn(
                        "relative rounded-lg px-3 py-2 text-sm shadow-sm",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted rounded-bl-none",
                        unread && "font-bold"
                      )}
                    >
                      {renderMessageContent(message)}
                      
                      <div className={cn(
                        "text-[10px] opacity-70 text-right mt-1 flex items-center",
                        isCurrentUser ? "justify-end" : "justify-start"
                      )}>
                        {formatMessageTime(message.created_at)}
                        
                        {isCurrentUser && (
                          <span className="ml-1 flex">
                            <Check className={cn(
                              "h-3 w-3",
                              read ? "text-blue-400" : "text-gray-400"
                            )} />
                            {read && <Check className="h-3 w-3 -ml-1.5 text-blue-400" />}
                          </span>
                        )}
                      </div>
                      
                      {unread && (
                        <div className="absolute -left-2 -top-1 h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
