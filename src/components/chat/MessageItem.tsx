
import { Message } from "@/components/chat/types/chat-detail";
import { cn } from "@/lib/utils";
import { MoreVertical, Trash2, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  unread: boolean;
  onDeleteClick: (messageId: string) => void;
  onReportClick: (messageId: string) => void;
}

const MessageItem = ({ 
  message, 
  isCurrentUser, 
  unread, 
  onDeleteClick, 
  onReportClick 
}: MessageItemProps) => {
  // Skip system or block messages
  if (message.is_system_message || message.is_block_message || message.is_report) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex group relative",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div className="relative max-w-[80%]">
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
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
        
        <div className={cn(
          "absolute top-0",
          isCurrentUser ? "-left-10" : "-right-10",
          "opacity-100 transition-opacity"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-muted/50 hover:bg-muted">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isCurrentUser ? "start" : "end"} className="w-48">
              {isCurrentUser && (
                <DropdownMenuItem 
                  className="flex items-center text-destructive cursor-pointer"
                  onClick={() => onDeleteClick(message.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Message
                </DropdownMenuItem>
              )}
              {!isCurrentUser && (
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={() => onReportClick(message.id)}
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Report Message
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
