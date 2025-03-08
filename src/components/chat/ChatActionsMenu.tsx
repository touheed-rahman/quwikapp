
import { Ban, Flag, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatActionsMenuProps {
  onBlockUser: () => void;
  onReportConversation: () => void;
}

const ChatActionsMenu = ({ onBlockUser, onReportConversation }: ChatActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2 opacity-100 flex">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          className="flex items-center cursor-pointer"
          onClick={onBlockUser}
        >
          <Ban className="mr-2 h-4 w-4" />
          Block User
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center text-destructive cursor-pointer"
          onClick={onReportConversation}
        >
          <Flag className="mr-2 h-4 w-4" />
          Report Conversation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatActionsMenu;
