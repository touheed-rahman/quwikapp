
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string | undefined;
  sessionUserId: string | undefined;
}

const ReportDialog = ({ open, onOpenChange, conversationId, sessionUserId }: ReportDialogProps) => {
  const [reportReason, setReportReason] = useState("inappropriate_content");
  const { toast } = useToast();

  const handleReport = async () => {
    if (!conversationId || !sessionUserId) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: sessionUserId,
          content: `REPORT CONVERSATION: ${reportReason}`,
          is_report: true,
          is_system_message: true
        });

      if (error) throw error;
      
      toast({
        title: "Conversation reported",
        description: "Thank you for helping keep our community safe."
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error reporting conversation",
        description: error.message || "Failed to report conversation"
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Report Conversation
          </AlertDialogTitle>
          <AlertDialogDescription>
            Why are you reporting this conversation?
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
            onClick={handleReport}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReportDialog;
