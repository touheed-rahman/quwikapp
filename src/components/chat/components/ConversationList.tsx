
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "../ConversationItem";
import { Conversation } from "../types/chat-window";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  onConversationClick: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
}

export const ConversationList = ({
  conversations,
  isLoading,
  onConversationClick,
  onDelete,
}: ConversationListProps) => {
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
            onClick={() => onConversationClick(conversation.id)}
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
                    onDelete(conversation.id);
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
