
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReportSpamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName?: string;
}

const ReportSpamDialog = ({
  open,
  onOpenChange,
  onConfirm,
  userName = "this user",
}: ReportSpamDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Spam</DialogTitle>
          <DialogDescription>
            Are you sure you want to report {userName} for spam? Our team will review this conversation.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
          >
            Report Spam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportSpamDialog;
