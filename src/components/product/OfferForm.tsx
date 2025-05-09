
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OfferFormProps {
  productId: string;
  productTitle: string;
  productPrice: number;
  sellerId: string;
  conversationId: string;
  onClose: () => void;
}

const OfferForm = ({
  productId,
  productTitle,
  productPrice,
  conversationId,
  onClose
}: OfferFormProps) => {
  const [offerAmount, setOfferAmount] = useState(Math.floor(productPrice * 0.9));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add a message about the offer
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        content: `I'd like to offer ₹${offerAmount} for this item.`,
        sender_id: (await supabase.auth.getSession()).data.session?.user.id,
        is_offer: true
      });
      
      // Create an offer record
      await supabase.from("offers").insert({
        conversation_id: conversationId,
        amount: offerAmount,
      });
      
      // Update the conversation's last message
      await supabase.from("conversations").update({
        last_message: `Offer: ₹${offerAmount}`,
        last_message_at: new Date().toISOString()
      }).eq("id", conversationId);
      
      toast({
        title: "Offer sent",
        description: "Your offer has been sent to the seller.",
      });
      
      onClose();
    } catch (error) {
      console.error("Error sending offer:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>Make an Offer</DialogTitle>
        <DialogDescription>
          Send your price offer for "{productTitle.length > 30 ? productTitle.substring(0, 30) + '...' : productTitle}"
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="amount">Your offer amount (₹)</Label>
            <span className="text-sm text-muted-foreground">
              Listed price: ₹{productPrice}
            </span>
          </div>
          <Input
            id="amount"
            type="number"
            value={offerAmount}
            onChange={(e) => setOfferAmount(Number(e.target.value))}
            min={1}
            max={productPrice}
            className="text-lg"
            required
          />
          <p className="text-xs text-muted-foreground">
            Offer an amount less than or equal to the listed price.
          </p>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send offer"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default OfferForm;
