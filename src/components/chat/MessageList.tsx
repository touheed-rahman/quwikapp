
import { Message } from "@/components/chat/types/chat-detail";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { useMessageDelete } from "@/hooks/chat/use-message-delete";
import DeleteMessageDialog from "@/components/chat/dialogs/DeleteMessageDialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { deleteMessage } = useMessageDelete();
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);

  // Update local messages when the prop changes
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const isUnread = (message: Message) => {
    return unreadMessages.some(unread => unread.id === message.id);
  };

  const handleDeleteClick = (messageId: string) => {
    setMessageToDelete(messageId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    
    const success = await deleteMessage(messageToDelete);
    
    if (success) {
      // Update the UI immediately
      setLocalMessages(prev => prev.filter(msg => msg.id !== messageToDelete));
    }
  };

  const renderMessageContent = (message: Message) => {
    // Check if it's an image message
    if (message.content.startsWith('[Image](') && message.content.includes(')')) {
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
    <div className="flex-1 space-y-4 p-4 overflow-y-auto scrollbar-hide">
      <AnimatePresence>
        {localMessages.map((message) => {
          const isCurrentUser = message.sender_id === sessionUserId;
          const unread = isUnread(message);

          return (
            <motion.div
              key={message.id}
              className={cn(
                "flex",
                isCurrentUser ? "justify-end" : "justify-start"
              )}
              initial={{ opacity: 1 }}
              exit={{ 
                opacity: 0,
                height: 0,
                marginBottom: 0,
                transition: { duration: 0.2 } 
              }}
              layout
            >
              <div className="group relative">
                <div
                  className={cn(
                    "relative max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm",
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
                
                {isCurrentUser && (
                  <div className="absolute -right-6 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-6 w-6 items-center justify-center rounded-full focus:outline-none">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => handleDeleteClick(message.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={messagesEndRef} />
      
      <DeleteMessageDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
