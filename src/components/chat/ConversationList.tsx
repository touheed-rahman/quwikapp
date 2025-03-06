
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./ConversationItem";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Conversation } from "./types/conversation";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  onDelete: (conversationId: string) => Promise<boolean>;
  onSelectConversation: (conversationId: string) => void;
  unreadCounts?: Record<string, number>;
  userId?: string;
}

const ConversationList = ({ 
  conversations, 
  isLoading, 
  onDelete,
  onSelectConversation,
  unreadCounts = {},
  userId
}: ConversationListProps) => {
  const navigate = useNavigate();

  const handleConversationClick = (conversation: Conversation) => {
    // Skip deleted conversations
    if (conversation.deleted) return;
    
    navigate(`/chat/${conversation.id}`);
    onSelectConversation(conversation.id);
  };

  // Filter out any deleted conversations just to be sure
  const availableConversations = conversations.filter(conv => !conv.deleted);

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading...</div>;
  }

  if (availableConversations.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No conversations</div>;
  }

  return (
    <ScrollArea className="flex-1">
      {availableConversations.map((conversation) => (
        <div key={conversation.id} className="relative">
          <ConversationItem
            conversation={conversation}
            onClick={() => handleConversationClick(conversation)}
            userId={userId}
            unreadCount={unreadCounts[conversation.id] || 0}
            onDelete={onDelete}
          />
        </div>
      ))}
    </ScrollArea>
  );
};

export default ConversationList;
