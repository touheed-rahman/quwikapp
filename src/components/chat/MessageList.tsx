
import { Message } from "@/components/chat/types/chat-detail";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
  sessionUserId?: string;
  unreadMessages?: Message[];
}

const MessageList = ({ messages, sessionUserId, unreadMessages = [] }: MessageListProps) => {
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
              {message.content}
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

export default MessageList;
