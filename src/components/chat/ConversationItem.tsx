
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation } from "./types/conversation";
import { useState } from "react";
import { motion } from "framer-motion";

interface ConversationItemProps {
  conversation: Conversation;
  onClick: () => void;
  userId?: string;
  unreadCount?: number;
  onDelete?: () => void;
}

export const ConversationItem = ({ 
  conversation, 
  onClick, 
  userId, 
  unreadCount = 0,
  onDelete
}: ConversationItemProps) => {
  const [isSwiping, setIsSwiping] = useState(false);
  
  // Enhanced logging for debugging
  if (!conversation) {
    console.error("ConversationItem received null conversation");
    return null;
  }

  // Don't render deleted conversations
  if (conversation.deleted || (conversation.deleted_by && conversation.deleted_by === userId)) {
    console.log("Skipping deleted conversation", conversation.id);
    return null;
  }

  // Ensure we have the necessary data before rendering
  if (!conversation.seller || !conversation.buyer || !conversation.listing) {
    console.error("Missing conversation data", {
      id: conversation.id,
      hasSeller: !!conversation.seller,
      hasBuyer: !!conversation.buyer,
      hasListing: !!conversation.listing
    });
    return null;
  }
  
  // Determine if the current user is the buyer
  const isBuyer = userId === conversation.buyer_id;
  
  // Get the other user (if you're the buyer, get the seller, and vice versa)
  const otherUser = isBuyer ? conversation.seller : conversation.buyer;
  
  // Format the date intelligently
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // If today, show time
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If yesterday, show "Yesterday"
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // If within the last 7 days, show day name
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 6);
    if (messageDate >= oneWeekAgo) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return messageDate.toLocaleDateString();
  };

  const handleSwipeComplete = (info: any) => {
    const offset = info.offset.x;
    if (offset < -100 && onDelete) {
      onDelete();
    }
    setIsSwiping(false);
  };
  
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={(_, info) => {
        if (info.offset.x < -5) {
          setIsSwiping(true);
        } else {
          setIsSwiping(false);
        }
      }}
      onDragEnd={handleSwipeComplete}
      className="relative"
    >
      {/* Delete indicator shown during swipe */}
      <div
        className={cn(
          "absolute inset-y-0 right-0 bg-red-500 text-white flex items-center justify-center transition-all",
          isSwiping ? "w-24 opacity-100" : "w-0 opacity-0"
        )}
      >
        <span className={cn("px-4", isSwiping ? "block" : "hidden")}>Delete</span>
      </div>
      
      <div
        className={cn(
          "px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-b relative bg-white",
          unreadCount > 0 && "bg-primary/5"
        )}
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <div className={cn(
              "w-full h-full rounded-full flex items-center justify-center text-white",
              isBuyer ? "bg-primary/90" : "bg-orange-500/90"
            )}>
              {otherUser.full_name?.[0] || 'U'}
            </div>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("font-medium", unreadCount > 0 && "font-bold")}>
                  {otherUser.full_name}
                </span>
                <Badge variant="outline" className="h-5 text-xs bg-primary/10 text-primary border-primary">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
                {unreadCount > 0 && (
                  <Badge variant="default" className="bg-primary text-white ml-1 py-0 px-2 h-5 min-w-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDate(conversation.last_message_at)}
              </span>
            </div>
            <p className="text-sm font-medium text-primary/90 mt-1 truncate max-w-[90%]">
              {conversation.listing.title}
            </p>
            <p className={cn(
              "text-sm text-muted-foreground truncate mt-1", 
              unreadCount > 0 && "font-bold text-foreground"
            )}>
              {conversation.last_message || "No messages yet"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
