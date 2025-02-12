
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WelcomeDialog = ({ open, onOpenChange }: WelcomeDialogProps) => {
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      setShouldShow(false);
      onOpenChange(false);
    } else {
      setShouldShow(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [onOpenChange]);

  const handleClose = () => {
    setShouldShow(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={shouldShow && open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            Welcome to Quwik App Beta! 🚀
          </DialogTitle>
          <DialogDescription className="text-center pt-4 space-y-2">
            <p className="text-lg">
              We're excited to announce the launch of our Beta version!
            </p>
            <p>
              While we're continuously improving, we'd love to hear your feedback on any issues you encounter during your experience.
            </p>
            <p className="text-sm text-muted-foreground">
              Thank you for being part of our development journey.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button 
            variant="default"
            size="lg"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Got it, thanks!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
