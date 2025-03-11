
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, UserX, ShieldAlert } from "lucide-react";

interface HeaderActionButtonsProps {
  onDeleteClick: () => void;
  onBlockClick: () => void;
  onReportClick: () => void;
}

const HeaderActionButtons = ({
  onDeleteClick,
  onBlockClick,
  onReportClick,
}: HeaderActionButtonsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <MoreVertical className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive" 
          onClick={onDeleteClick}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Chat
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onBlockClick}>
          <UserX className="h-4 w-4 mr-2" />
          Block User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onReportClick}>
          <ShieldAlert className="h-4 w-4 mr-2" />
          Report Spam
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderActionButtons;
