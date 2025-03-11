
import { ArrowLeft, Circle, MoreVertical, Trash2, ShieldAlert, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import type { ConversationDetails } from "./types/chat-detail";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!conversationDetails) return null;

  // Determine if listing is no longer available
  const isListingAvailable = !(
    !conversationDetails.listing || 
    conversationDetails.listing.deleted_at || 
    conversationDetails.listing.status === 'sold'
  );
  
  // Get the first character of the seller's name for the avatar
  const nameInitial = conversationDetails.seller?.full_name?.[0] || 'S';

  // Determine the other user (not the current session user)
  const otherUser = sessionUserId === conversationDetails.seller_id 
    ? conversationDetails.buyer 
    : conversationDetails.seller;

  const handleDeleteChat = async () => {
    try {
      if (!conversationDetails.id) return;
      
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
      setIsDeleteDialogOpen(false);
    }
  };

  const handleBlockUser = async () => {
    try {
      if (!otherUser?.id || !sessionUserId) return;
      
      // Insert a record in the blocked_users table
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: sessionUserId,
          blocked_id: otherUser.id
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
      setIsBlockDialogOpen(false);
    }
  };

  const handleReportSpam = async () => {
    try {
      if (!otherUser?.id || !sessionUserId || !conversationDetails.id) return;
      
      // Insert a record in the reported_conversations table
      const { error } = await supabase
        .from('reported_conversations')
        .insert({
          reporter_id: sessionUserId,
          reported_id: otherUser.id,
          conversation_id: conversationDetails.id,
          reason: 'spam'
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
      setIsReportDialogOpen(false);
    }
  };

  return (
    <header className="border-b p-4 flex items-center gap-3 bg-background/95 backdrop-blur sticky top-0 z-10">
      <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="relative">
        <Avatar className="h-10 w-10">
          <div className="bg-primary/90 text-white w-full h-full rounded-full flex items-center justify-center">
            {nameInitial}
          </div>
        </Avatar>
        
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold truncate">
            {conversationDetails.seller?.full_name || 'Seller'}
            {isOnline && (
              <span className="ml-2 inline-flex items-center text-xs font-medium text-green-600">
                <Circle className="h-2 w-2 mr-1 fill-green-500 text-green-500" />
                Online
              </span>
            )}
          </h2>
        </div>
        <p className={cn(
          "text-sm truncate",
          isListingAvailable ? "text-muted-foreground" : "text-destructive"
        )}>
          {isListingAvailable 
            ? conversationDetails.listing?.title
            : "This item is no longer available"
          }
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Chat
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsBlockDialogOpen(true)}>
            <UserX className="h-4 w-4 mr-2" />
            Block User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
            <ShieldAlert className="h-4 w-4 mr-2" />
            Report Spam
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Chat Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              This will permanently delete this conversation and all messages. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteChat}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block User Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Are you sure you want to block {otherUser?.full_name}? They will no longer be able to message you or see your listings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleBlockUser}
            >
              Block User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Spam Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Spam</DialogTitle>
            <DialogDescription>
              Are you sure you want to report {otherUser?.full_name} for spam? Our team will review this conversation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReportSpam}
            >
              Report Spam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default ChatDetailHeader;
