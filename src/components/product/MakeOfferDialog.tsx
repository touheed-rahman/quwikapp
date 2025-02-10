
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
      const { error } = await supabase.from("offers").insert({
        conversation_id: conversationId,
        amount: parseFloat(amount),
      });

      if (error) throw error;

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
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            Send your offer for {productTitle}. Current price is ₹{productPrice.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
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
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Send Offer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
