
import { Message } from "@/components/chat/types/chat-detail";
import { useEffect, useRef, useState } from "react";
import MessageItem from "@/components/chat/MessageItem";
import DeleteMessageDialog from "@/components/chat/DeleteMessageDialog";
import ReportMessageDialog from "@/components/chat/ReportMessageDialog";

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

  const confirmReport = async (reason: string) => {
    if (selectedMessageId && onReportMessage) {
      await onReportMessage(selectedMessageId, reason);
      setReportDialogOpen(false);
      setSelectedMessageId(null);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 overflow-y-auto">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === sessionUserId;
        const unread = isUnread(message);
        
        return (
          <MessageItem 
            key={message.id}
            message={message}
            isCurrentUser={isCurrentUser}
            unread={unread}
            onDeleteClick={handleDeleteClick}
            onReportClick={handleReportClick}
          />
        );
      })}
      <div ref={messagesEndRef} />

      {/* Delete Message Dialog */}
      <DeleteMessageDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
      />

      {/* Report Message Dialog */}
      <ReportMessageDialog 
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        onConfirmReport={confirmReport}
      />
    </div>
  );
};
