
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, MessageSquare, Clock, Phone, Video, Image, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation } from "./types/conversation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";

interface ConversationItemProps {
  conversation: Conversation;
  onClick: () => void;
  userId?: string;
  unreadCount?: number;
  isSelected?: boolean;
}

export const ConversationItem = ({ 
  conversation, 
  onClick, 
  userId, 
  unreadCount = 0,
  isSelected = false
}: ConversationItemProps) => {
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
  
  // Determine message type icon
  const getMessageTypeIcon = (messageContent?: string) => {
    if (!messageContent) return null;
    
    if (messageContent.includes('image:')) {
      return <Image className="h-3.5 w-3.5 mr-1.5 text-blue-500" />;
    } else if (messageContent.includes('offer:')) {
      return <ShoppingCart className="h-3.5 w-3.5 mr-1.5 text-green-500" />;
    } else if (messageContent.includes('call:')) {
      return <Phone className="h-3.5 w-3.5 mr-1.5 text-purple-500" />;
    } else if (messageContent.includes('video:')) {
      return <Video className="h-3.5 w-3.5 mr-1.5 text-red-500" />;
    } 
    return <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />;
  };

  // Get the time when the message was sent in relative format
  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Extract the first name of the user
  const getFirstName = (fullName?: string) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };
  
  return (
    <div
      className={cn(
        "px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer border-b relative",
        unreadCount > 0 && "bg-primary/5",
        isSelected && "bg-primary/10 border-l-4 border-l-primary"
      )}
      onClick={onClick}
      aria-selected={isSelected}
      role="option"
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={otherUser.avatar_url} alt={otherUser.full_name} />
            <AvatarFallback className={cn(
              "w-full h-full rounded-full flex items-center justify-center text-white",
              isBuyer ? "bg-primary/90" : "bg-orange-500/90"
            )}>
              {otherUser.full_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          
          {/* Online indicator */}
          {otherUser.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("font-medium truncate max-w-[100px]", unreadCount > 0 && "font-bold")}>
                {getFirstName(otherUser.full_name)}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="h-5 text-xs bg-primary/10 text-primary border-primary">
                      <Check className="h-3 w-3 mr-1" />
                      {isBuyer ? "Seller" : "Buyer"}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verified {isBuyer ? "Seller" : "Buyer"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {unreadCount > 0 && (
                <Badge variant="default" className="bg-primary text-white ml-1 py-0 px-2 h-5 min-w-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">
                {formatDate(conversation.last_message_at)}
              </span>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {getRelativeTime(conversation.last_message_at)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Last activity: {new Date(conversation.last_message_at || '').toLocaleString()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-orange-50 text-orange-700 border-orange-200 truncate max-w-[120px]">
              {conversation.listing.title}
            </Badge>
            {conversation.listing.price > 0 && (
              <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200">
                ₹{conversation.listing.price.toLocaleString()}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center mt-2">
            {getMessageTypeIcon(conversation.last_message)}
            <p className={cn(
              "text-xs text-muted-foreground truncate", 
              unreadCount > 0 && "font-medium text-foreground"
            )}>
              {conversation.last_message || "Start the conversation..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
