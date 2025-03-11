
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConversationDetails } from "./types/chat-detail";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import HeaderUserInfo from "./HeaderUserInfo";
import HeaderActionButtons from "./HeaderActionButtons";
import DeleteChatDialog from "./dialogs/DeleteChatDialog";

interface ChatDetailHeaderProps {
  conversationDetails: ConversationDetails | null;
  onBack: () => void;
  isOnline?: boolean;
  sessionUserId?: string | null;
}

const ChatDetailHeader = ({ 
  conversationDetails, 
  onBack,
  isOnline = false,
  sessionUserId
}: ChatDetailHeaderProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!conversationDetails) return null;

  const handleDeleteChat = async () => {
    try {
      if (!conversationDetails.id || isProcessing) return;
      
      setIsProcessing(true);
      
      // Update the conversation with a deleted_by field that includes this user ID
      const { error } = await supabase
        .from('conversations')
        .update({ 
          deleted_by: sessionUserId 
        })
        .eq('id', conversationDetails.id);
        
      if (error) throw error;
      
      toast({
        title: "Chat deleted",
        description: "The conversation has been deleted from your chat list."
      });
      
      // Navigate back to the conversations list
      navigate('/');
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete chat. Please try again."
      });
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <header className="border-b p-4 flex items-center gap-3 bg-background/95 backdrop-blur sticky top-0 z-10">
      <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      {conversationDetails && (
        <HeaderUserInfo 
          conversationDetails={conversationDetails} 
          isOnline={isOnline} 
          sessionUserId={sessionUserId} 
        />
      )}

      <div className="ml-auto">
        <HeaderActionButtons 
          onDeleteClick={() => setIsDeleteDialogOpen(true)}
          isProcessing={isProcessing}
        />
      </div>

      <DeleteChatDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        onConfirm={handleDeleteChat} 
      />
    </header>
  );
};

export default ChatDetailHeader;
