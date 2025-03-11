
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
import BlockUserDialog from "./dialogs/BlockUserDialog";
import ReportSpamDialog from "./dialogs/ReportSpamDialog";

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
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!conversationDetails) return null;

  // Determine the other user (not the current session user)
  const otherUser = sessionUserId === conversationDetails.seller_id 
    ? conversationDetails.buyer 
    : conversationDetails.seller;

  const handleDeleteChat = async () => {
    try {
      if (!conversationDetails.id || isProcessing) return;
      
      setIsProcessing(true);
      
      // Mark the conversation as deleted
      const { error } = await supabase
        .from('conversations')
        .update({ deleted: true })
        .eq('id', conversationDetails.id);
        
      if (error) throw error;
      
      toast({
        title: "Chat deleted",
        description: "The conversation has been permanently deleted."
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

  const handleBlockUser = async () => {
    try {
      if (!otherUser?.id || !sessionUserId || isProcessing) return;
      
      setIsProcessing(true);
      
      // Create a system message indicating user was blocked
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationDetails.id,
          sender_id: sessionUserId,
          content: `User ${otherUser.full_name} was blocked`,
          is_system_message: true,
          is_block_message: true
        });
        
      if (error) throw error;
      
      toast({
        title: "User blocked",
        description: `You have blocked ${otherUser.full_name}. They can no longer message you.`
      });
      
      // Navigate back to the conversations list
      navigate('/');
    } catch (error) {
      console.error('Error blocking user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to block user. Please try again."
      });
    } finally {
      setIsProcessing(false);
      setIsBlockDialogOpen(false);
    }
  };

  const handleReportSpam = async () => {
    try {
      if (!otherUser?.id || !sessionUserId || !conversationDetails.id || isProcessing) return;
      
      setIsProcessing(true);
      
      // Create a system message indicating conversation was reported
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationDetails.id,
          sender_id: sessionUserId,
          content: `Reported conversation as spam`,
          is_system_message: true,
          is_report: true
        });
        
      if (error) throw error;
      
      toast({
        title: "Report submitted",
        description: "Thank you for reporting. We'll review this conversation."
      });
    } catch (error) {
      console.error('Error reporting spam:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit report. Please try again."
      });
    } finally {
      setIsProcessing(false);
      setIsReportDialogOpen(false);
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

      <HeaderActionButtons 
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
        onBlockClick={() => setIsBlockDialogOpen(true)}
        onReportClick={() => setIsReportDialogOpen(true)}
        isProcessing={isProcessing}
      />

      <DeleteChatDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        onConfirm={handleDeleteChat} 
      />

      <BlockUserDialog 
        open={isBlockDialogOpen} 
        onOpenChange={setIsBlockDialogOpen} 
        onConfirm={handleBlockUser}
        userName={otherUser?.full_name}
      />

      <ReportSpamDialog 
        open={isReportDialogOpen} 
        onOpenChange={setIsReportDialogOpen} 
        onConfirm={handleReportSpam}
        userName={otherUser?.full_name}
      />
    </header>
  );
};

export default ChatDetailHeader;
