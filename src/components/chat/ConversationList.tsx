
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./ConversationItem";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Conversation } from "./types/conversation";
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
import { useState, useEffect } from "react";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [localConversations, setLocalConversations] = useState<Conversation[]>([]);
  
  // Initialize local state with filtered conversations
  useEffect(() => {
    setLocalConversations(conversations.filter(conv => !conv.deleted));
  }, [conversations]);

  const handleConversationClick = (conversation: Conversation) => {
    // Skip deleted conversations
    if (conversation.deleted) return;
    
    navigate(`/chat/${conversation.id}`);
    onSelectConversation(conversation.id);
  };

  const confirmDelete = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedConversation(conversation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedConversation) {
      // Remove the deleted conversation from the local state immediately
      setLocalConversations(prev => prev.filter(conv => conv.id !== selectedConversation.id));
      
      // Then perform the actual delete operation
      const success = await onDelete(selectedConversation.id);
      
      if (!success) {
        // If the delete fails, restore the conversation in the local state
        setLocalConversations(prev => [...prev, selectedConversation]);
      }
      
      setDeleteDialogOpen(false);
      setSelectedConversation(null);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading...</div>;
  }

  if (localConversations.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No conversations</div>;
  }

  return (
    <>
      <ScrollArea className="flex-1">
        {localConversations.map((conversation) => (
          <div key={conversation.id} className="group relative">
            <ConversationItem
              conversation={conversation}
              onClick={() => handleConversationClick(conversation)}
              userId={userId}
              unreadCount={unreadCounts[conversation.id] || 0}
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
                    onClick={(e) => confirmDelete(conversation, e)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Chat
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation and all messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirmed}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConversationList;
