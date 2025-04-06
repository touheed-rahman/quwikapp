
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./ConversationItem";
import { useNavigate } from "react-router-dom";
import type { Conversation } from "./types/conversation";
import { useState, useEffect } from "react";
import DeleteChatDialog from "./dialogs/DeleteChatDialog";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowDown, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  onDelete: (conversationId: string) => Promise<boolean>;
  onSelectConversation: (conversationId: string) => void;
  unreadCounts?: Record<string, number>;
  userId?: string;
  selectedConversationId?: string | null;
}

const ConversationList = ({ 
  conversations, 
  isLoading, 
  onDelete,
  onSelectConversation,
  unreadCounts = {},
  userId,
  selectedConversationId
}: ConversationListProps) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localConversations, setLocalConversations] = useState<Conversation[]>([]);
  const [scrollToUnread, setScrollToUnread] = useState(false);
  
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
        
        // If the deleted conversation was the selected one, navigate back
        if (selectedConversation.id === selectedConversationId) {
          navigate('/');
        }
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

  // Function to find the first unread conversation
  const findFirstUnreadConversation = () => {
    const firstUnread = localConversations.find(
      conv => (unreadCounts[conv.id] || 0) > 0
    );
    
    if (firstUnread) {
      // Find the element and scroll to it
      const element = document.getElementById(`conversation-${firstUnread.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    setScrollToUnread(false);
  };

  // Check if there are any unread conversations
  const hasUnreadConversations = Object.values(unreadCounts).some(count => count > 0);

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading conversations...</div>;
  }

  if (localConversations.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No conversations</div>;
  }

  return (
    <div className="relative flex-1 flex flex-col">
      <ScrollArea className="flex-1">
        <AnimatePresence initial={false}>
          {localConversations.map((conversation) => (
            <motion.div 
              key={conversation.id}
              id={`conversation-${conversation.id}`}
              className="group relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ConversationItem
                conversation={conversation}
                onClick={() => handleConversationClick(conversation)}
                userId={userId}
                unreadCount={unreadCounts[conversation.id] || 0}
                isSelected={conversation.id === selectedConversationId}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => confirmDelete(conversation, e)}
                        disabled={isDeleting && selectedConversation?.id === conversation.id}
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete conversation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
      
      {/* Floating button to scroll to unread conversations */}
      {hasUnreadConversations && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary"
                size="sm"
                className="absolute bottom-4 right-4 shadow-md opacity-90"
                onClick={findFirstUnreadConversation}
                aria-label="Jump to unread conversations"
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                Unread
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Jump to unread conversations</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <DeleteChatDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
};

export default ConversationList;
