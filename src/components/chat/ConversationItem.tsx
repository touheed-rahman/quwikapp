
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "./types";

interface ConversationItemProps {
  conversation: Conversation;
  userId: string;
  onClick: (conversationId: string) => void;
}

export const ConversationItem = ({ conversation, userId, onClick }: ConversationItemProps) => {
  return (
    <div
      className={cn(
        "px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-b"
      )}
      onClick={() => onClick(conversation.id)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <div className={cn(
            "w-full h-full rounded-full flex items-center justify-center text-white",
            userId === conversation.buyer_id ? "bg-primary" : "bg-orange-500"
          )}>
            {conversation.seller.full_name[0]}
          </div>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{conversation.seller.full_name}</span>
              <Badge variant="outline" className="h-5 text-xs bg-primary/10 text-primary border-primary">
                <Check className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date(conversation.last_message_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm font-medium text-primary mt-1">
            {conversation.listing.title}
            {conversation.listing.price && ` - ₹${conversation.listing.price}`}
          </p>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {conversation.last_message}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
