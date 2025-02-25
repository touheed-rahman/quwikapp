
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Trash2, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ConversationDetails } from "./types/chat-detail";
import MakeOfferDialog from "@/components/product/MakeOfferDialog";

interface ChatDetailHeaderProps {
  conversationDetails: ConversationDetails | null;
  onBack: () => void;
}

const ChatDetailHeader = ({ conversationDetails, onBack }: ChatDetailHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!conversationDetails?.id || isDeleting) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationDetails.id);

      if (error) throw error;

      toast({
        title: "Chat deleted",
        description: "The conversation has been deleted successfully."
      });
      navigate(-1);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete the conversation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOfferSuccess = () => {
    setIsOfferDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-semibold">
              {conversationDetails?.listing?.title || "Loading..."}
            </h2>
            <p className="text-sm text-muted-foreground">
              {conversationDetails?.listing?.price
                ? `₹${conversationDetails.listing.price.toLocaleString()}`
                : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOfferDialogOpen(true)}
            className="mr-2"
          >
            <Tag className="h-4 w-4 mr-2" />
            Make Offer
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isDeleting}>
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {conversationDetails && (
        <MakeOfferDialog
          isOpen={isOfferDialogOpen}
          onClose={() => setIsOfferDialogOpen(false)}
          productTitle={conversationDetails.listing?.title || ""}
          productPrice={conversationDetails.listing?.price || 0}
          conversationId={conversationDetails.id}
          onOfferSuccess={handleOfferSuccess}
        />
      )}
    </>
  );
};

export default ChatDetailHeader;
