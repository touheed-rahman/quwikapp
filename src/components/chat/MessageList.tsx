
import type { Message } from "./types/chat-detail";

interface MessageListProps {
  messages: Message[];
  sessionUserId: string;
}

const MessageList = ({ messages, sessionUserId }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender_id === sessionUserId ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${
              message.sender_id === sessionUserId 
                ? "bg-blue-100 text-blue-900" 
                : "bg-white border"
            }`}
          >
            <p className="break-words">{message.content}</p>
            <div className={`text-xs mt-1 ${
              message.sender_id === sessionUserId 
                ? "text-blue-700" 
                : "text-muted-foreground"
            }`}>
              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;

