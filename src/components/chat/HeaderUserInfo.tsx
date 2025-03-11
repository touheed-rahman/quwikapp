
import { Circle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ConversationDetails } from "./types/chat-detail";

interface HeaderUserInfoProps {
  conversationDetails: ConversationDetails;
  isOnline?: boolean;
  sessionUserId?: string | null;
}

const HeaderUserInfo = ({ 
  conversationDetails, 
  isOnline = false,
  sessionUserId
}: HeaderUserInfoProps) => {
  // Determine if listing is no longer available
  const isListingAvailable = !(
    !conversationDetails.listing || 
    conversationDetails.listing.deleted_at || 
    conversationDetails.listing.status === 'sold'
  );
  
  // Get the first character of the seller's name for the avatar
  const nameInitial = conversationDetails.seller?.full_name?.[0] || 'S';

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="relative">
        <Avatar className="h-10 w-10">
          <div className="bg-primary/90 text-white w-full h-full rounded-full flex items-center justify-center">
            {nameInitial}
          </div>
        </Avatar>
        
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold truncate">
            {conversationDetails.seller?.full_name || 'Seller'}
            {isOnline && (
              <span className="ml-2 inline-flex items-center text-xs font-medium text-green-600">
                <Circle className="h-2 w-2 mr-1 fill-green-500 text-green-500" />
                Online
              </span>
            )}
          </h2>
        </div>
        <p className={cn(
          "text-sm truncate",
          isListingAvailable ? "text-muted-foreground" : "text-destructive"
        )}>
          {isListingAvailable 
            ? conversationDetails.listing?.title
            : "This item is no longer available"
          }
        </p>
      </div>
    </div>
  );
};

export default HeaderUserInfo;
