
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationItemProps {
  conversation: any;
  onClick: () => void;
  userId?: string;
  unreadCount?: number;
  onDelete: (conversationId: string) => Promise<boolean>;
}

export const ConversationItem = ({ 
  conversation, 
  onClick, 
  userId, 
  unreadCount = 0,
  onDelete
}: ConversationItemProps) => {
  // Don't render deleted conversations
  if (conversation.deleted) {
    return null;
  }
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(conversation.id);
  };
  
  return (
    <div
      className={cn(
        "px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-b relative",
        unreadCount > 0 && "bg-primary/5"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <div className={cn(
            "w-full h-full rounded-full flex items-center justify-center text-white",
            userId === conversation.buyer_id ? "bg-primary/90" : "bg-orange-500/90"
          )}>
            {conversation.seller.full_name?.[0] || 'U'}
          </div>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("font-medium", unreadCount > 0 && "font-bold")}>
                {conversation.seller.full_name}
              </span>
              <Badge variant="outline" className="h-5 text-xs bg-primary/10 text-primary border-primary">
                <Check className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date(conversation.last_message_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm font-medium text-primary/90 mt-1">
            {conversation.listing.title}
            {conversation.listing.price && ` - ₹${conversation.listing.price}`}
          </p>
          <p className={cn(
            "text-sm text-muted-foreground truncate mt-1", 
            unreadCount > 0 && "font-bold text-foreground"
          )}>
            {conversation.last_message}
          </p>
        </div>
      </div>
      
      {/* Three-dot menu */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {unreadCount > 0 && (
          <Badge variant="default" className="bg-primary rounded-full h-6 w-6 flex items-center justify-center p-0">
            {unreadCount}
          </Badge>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
