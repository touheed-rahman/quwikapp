
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

  const handleConversationClick = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
    onSelectConversation(conversationId);
  };

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading...</div>;
  }

  if (conversations.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No conversations</div>;
  }

  return (
    <ScrollArea className="flex-1">
      {conversations.map((conversation) => (
        <div key={conversation.id} className="group relative">
          <ConversationItem
            conversation={conversation}
            onClick={() => handleConversationClick(conversation.id)}
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
