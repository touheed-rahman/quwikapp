
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderActionButtonsProps {
  onDeleteClick: () => void;
  isProcessing?: boolean;
}

const HeaderActionButtons = ({
  onDeleteClick,
  isProcessing = false,
}: HeaderActionButtonsProps) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full h-8 w-8" 
      disabled={isProcessing}
      onClick={onDeleteClick}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-5 w-5 text-destructive" />
      )}
      <span className="sr-only">Delete chat</span>
    </Button>
  );
};

export default HeaderActionButtons;
