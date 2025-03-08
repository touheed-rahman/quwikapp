
import { Message } from "@/components/chat/types/chat-detail";
import { cn } from "@/lib/utils";
import { MoreVertical, Trash2, AlertTriangle, Flag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export interface MessageListProps {
  messages: Message[];
  sessionUserId?: string;
  unreadMessages?: Message[];
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onReportMessage?: (messageId: string, reason: string) => Promise<void>;
}

export const MessageList = ({ 
  messages, 
  sessionUserId, 
  unreadMessages = [],
  onDeleteMessage,
  onReportMessage 
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("inappropriate_content");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isUnread = (message: Message) => {
    return unreadMessages.some(unread => unread.id === message.id);
  };

  const handleDeleteClick = (messageId: string) => {
    setSelectedMessageId(messageId);
    setDeleteDialogOpen(true);
  };

  const handleReportClick = (messageId: string) => {
    setSelectedMessageId(messageId);
    setReportDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedMessageId && onDeleteMessage) {
      await onDeleteMessage(selectedMessageId);
      setDeleteDialogOpen(false);
      setSelectedMessageId(null);
    }
  };

  const confirmReport = async () => {
    if (selectedMessageId && onReportMessage) {
      await onReportMessage(selectedMessageId, reportReason);
      setReportDialogOpen(false);
      setSelectedMessageId(null);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 overflow-y-auto">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === sessionUserId;
        const unread = isUnread(message);
        
        // Skip system or block messages
        if (message.is_system_message || message.is_block_message || message.is_report) {
          return null;
        }

        return (
          <div
            key={message.id}
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
                "md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity"
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
                        onClick={() => handleDeleteClick(message.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Message
                      </DropdownMenuItem>
                    )}
                    {!isCurrentUser && (
                      <DropdownMenuItem 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleReportClick(message.id)}
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
      })}
      <div ref={messagesEndRef} />

      {/* Delete Message Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Message
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Message Dialog */}
      <AlertDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Report Message
            </AlertDialogTitle>
            <AlertDialogDescription>
              Why are you reporting this message?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <select 
              value={reportReason} 
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-2 rounded-md border border-input"
            >
              <option value="inappropriate_content">Inappropriate Content</option>
              <option value="harassment">Harassment</option>
              <option value="spam">Spam</option>
              <option value="scam">Scam</option>
              <option value="other">Other</option>
            </select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmReport}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
