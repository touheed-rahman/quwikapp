
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MakeOfferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productPrice: number;
  conversationId: string | null;
  onOfferSuccess: () => void;
}

export default function MakeOfferDialog({
  isOpen,
  onClose,
  productTitle,
  productPrice,
  conversationId,
  onOfferSuccess,
}: MakeOfferDialogProps) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversationId) {
      toast({
        title: "Error",
        description: "Please start a chat with the seller first",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // First create the offer record
      const { error: offerError } = await supabase.from("offers").insert({
        conversation_id: conversationId,
        amount: parseFloat(amount),
      });

      if (offerError) throw offerError;

      // Then send the message with just the number and mark it as an offer
      const { error: messageError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        content: `${parseFloat(amount)}`,
        is_offer: true,
        sender_id: session.user.id
      });

      if (messageError) throw messageError;

      toast({
        title: "Success",
        description: "Your offer has been sent to the seller",
      });
      onOfferSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Make an Offer</DialogTitle>
          <DialogDescription className="text-foreground/80">
            Send your offer for {productTitle}. Current price is ₹{productPrice.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-foreground">
              Your Offer (₹)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              required
              className="col-span-3 text-foreground"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white">
              Send Offer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
