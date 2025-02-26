
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onClose: () => void;
}

export const ChatHeader = ({ onClose }: ChatHeaderProps) => (
  <div className="flex items-center justify-between p-4 border-b">
    <h2 className="text-lg font-semibold">Messages</h2>
    <Button variant="ghost" size="icon" onClick={onClose}>
      <X className="h-5 w-5" />
    </Button>
  </div>
);
