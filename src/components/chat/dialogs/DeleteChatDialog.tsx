
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

const DeleteChatDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteChatDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(newState) => {
      if (isDeleting) return; // Prevent closing while deleting
      onOpenChange(newState);
    }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center text-xl">Delete Chat</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This will remove this conversation from your chat list. You won't be able to see the messages anymore. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
          <AlertDialogCancel asChild>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              variant="destructive" 
              onClick={handleConfirm}
              className="w-full sm:w-auto"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteChatDialog;
