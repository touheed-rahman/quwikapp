
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./ConversationItem";
import { useNavigate } from "react-router-dom";
import type { Conversation } from "./types/conversation";
import { useState, useEffect } from "react";
import DeleteChatDialog from "./dialogs/DeleteChatDialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [localConversations, setLocalConversations] = useState<Conversation[]>([]);
  
  // Initialize local state with conversations
  useEffect(() => {
    // Filter conversations that should be shown to this user
    const filteredConversations = conversations.filter(conv => 
      !conv.deleted && (!conv.deleted_by || conv.deleted_by !== userId)
    );
    console.log('Filtered conversations for display:', filteredConversations.length);
    setLocalConversations(filteredConversations);
  }, [conversations, userId]);

  const handleConversationClick = (conversation: Conversation) => {
    navigate(`/chat/${conversation.id}`);
    onSelectConversation(conversation.id);
  };

  const confirmDelete = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedConversation(conversation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedConversation && !isDeleting) {
      try {
        setIsDeleting(true);
        
        // Remove the deleted conversation from the local state immediately
        setLocalConversations(prev => prev.filter(conv => conv.id !== selectedConversation.id));
        
        // Then perform the actual delete operation
        await onDelete(selectedConversation.id);
      } catch (error) {
        console.error("Error deleting conversation:", error);
        // If deletion fails, restore the conversation in local state
        if (selectedConversation) {
          setLocalConversations(prev => [...prev, selectedConversation]);
        }
      } finally {
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setSelectedConversation(null);
      }
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
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => confirmDelete(conversation, e)}
                disabled={isDeleting && selectedConversation?.id === conversation.id}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </ScrollArea>

      <DeleteChatDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirmed}
      />
    </>
  );
};

export default ConversationList;
