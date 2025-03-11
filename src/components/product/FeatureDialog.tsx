
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeatureDialog({
  isOpen,
  onClose,
}: FeatureDialogProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    // Email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waiting_for_feature')
        .insert([{ email }]);

      if (error) throw error;

      toast({
        title: "Thank you for your interest!",
        description: "We'll notify you as soon as featuring launches with special early-bird pricing!",
        variant: "default",
      });
      
      setEmail("");
      onClose();
    } catch (error) {
      if (error.code === '23505') {
        toast({
          title: "Already registered",
          description: "This email is already registered for feature notifications",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            🌟 Feature Your Listing
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            <p className="mb-2">Get ready for something special! Our featuring service is launching soon with incredible introductory prices.</p>
            <p className="font-medium text-primary">
              Early subscribers will receive exclusive discounts that are way more affordable than you think!
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Notify Me"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
