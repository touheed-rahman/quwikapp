
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./ConversationItem";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Conversation } from "./types/conversation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  onDelete: (conversationId: string) => Promise<boolean>;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationList = ({ 
  conversations, 
  isLoading, 
  onDelete,
  onSelectConversation
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
        <div key={conversation.id} className="group relative">
          <ConversationItem
            conversation={conversation}
            onClick={() => handleConversationClick(conversation)}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conversation.id).then(success => {
                      if (success && window.location.pathname.includes(`/chat/${conversation.id}`)) {
                        navigate('/');
                      }
                    });
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};

export default ConversationList;
