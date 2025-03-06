
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
  title: string;
}

export const ChatHeader = ({ onClose, title }: ChatHeaderProps) => {
  return (
    <div className="border-b p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <h3 className="font-semibold text-xl">{title}</h3>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search chats..." 
            className="pl-9 h-9 bg-muted/50"
          />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="hover:bg-destructive/10 hover:text-destructive"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
