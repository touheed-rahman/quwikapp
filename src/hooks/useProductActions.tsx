
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useProductActions = (productId: string | undefined, sellerId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const handleChatWithSeller = async (session: any) => {
    if (!productId || !sellerId) return;
    
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat with the seller",
        variant: "destructive"
      });
      navigate('/profile');
      return;
    }

    if (session.user.id === sellerId) {
      toast({
        title: "Cannot chat with yourself",
        description: "This is your own listing",
        variant: "destructive"
      });
      return;
    }

    try {
      // Find existing conversation
      const { data: existingConversation, error: conversationError } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', productId)
        .eq('buyer_id', session.user.id)
        .eq('deleted', false) // Only get non-deleted conversations
        .maybeSingle();

      if (conversationError && conversationError.code !== 'PGRST116') {
        throw conversationError;
      }

      if (existingConversation) {
        navigate(`/chat/${existingConversation.id}`);
        return;
      }

      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          listing_id: productId,
          buyer_id: session.user.id,
          seller_id: sellerId,
          deleted: false
        })
        .select()
        .single();

      if (createError) throw createError;
      navigate(`/chat/${newConversation.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive"
      });
      console.error('Chat error:', error);
    }
  };

  const handleMakeOffer = async (session: any) => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make an offer",
        variant: "destructive"
      });
      navigate('/profile');
      return;
    }

    if (!currentConversationId) {
      await handleChatWithSeller(session);
    }
    
    setIsOfferDialogOpen(true);
  };

  return {
    isOfferDialogOpen,
    setIsOfferDialogOpen,
    currentConversationId,
    handleChatWithSeller,
    handleMakeOffer
  };
};
