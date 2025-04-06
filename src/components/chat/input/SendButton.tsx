
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface SendButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSending: boolean;
}

const SendButton = ({ onClick, disabled, isSending }: SendButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      className="bg-primary hover:bg-primary/90"
    >
      {isSending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
    </Button>
  );
};

export default SendButton;
