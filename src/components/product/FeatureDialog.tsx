
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

interface FeatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeatureDialog({
  isOpen,
  onClose,
}: FeatureDialogProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    // Email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Just show a success toast for now
    toast({
      title: "Thank you!",
      description: "We'll notify you when the feature is launched.",
      variant: "default",
    });
    
    // Clear form and close dialog
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Feature Coming Soon!</DialogTitle>
          <DialogDescription>
            Our featuring service is coming soon. Leave your email and we'll notify you when it launches.
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
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Notify Me
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
