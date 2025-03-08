
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReportMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmReport: (reason: string) => Promise<void>;
}

const ReportMessageDialog = ({ 
  open, 
  onOpenChange, 
  onConfirmReport 
}: ReportMessageDialogProps) => {
  const [reportReason, setReportReason] = useState("inappropriate_content");

  const handleConfirm = async () => {
    await onConfirmReport(reportReason);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Report Message
          </AlertDialogTitle>
          <AlertDialogDescription>
            Why are you reporting this message?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <select 
            value={reportReason} 
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full p-2 rounded-md border border-input"
          >
            <option value="inappropriate_content">Inappropriate Content</option>
            <option value="harassment">Harassment</option>
            <option value="spam">Spam</option>
            <option value="scam">Scam</option>
            <option value="other">Other</option>
          </select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReportMessageDialog;
