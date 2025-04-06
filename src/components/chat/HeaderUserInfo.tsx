
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ConversationDetails } from "./types/chat-detail";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../ui/button";
import { MoreVertical, Star, Flag, Ban, UserX } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface HeaderUserInfoProps {
  conversationDetails: ConversationDetails;
  isOnline?: boolean;
  lastSeen?: string | null;
  sessionUserId?: string | null;
}

const HeaderUserInfo = ({
  conversationDetails,
  isOnline = false,
  lastSeen = null,
  sessionUserId
}: HeaderUserInfoProps) => {
  const [listing, setListing] = useState(conversationDetails.listing);
  const isCurrentUserBuyer = sessionUserId === conversationDetails.buyer_id;
  
  const otherUser = isCurrentUserBuyer 
    ? conversationDetails.seller 
    : conversationDetails.buyer;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate a stable color from the user ID
  const getAvatarColor = (userId: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 
      'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
    ];
    
    const hash = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };
  
  const handleUserAction = (action: string) => {
    // Placeholder for future functionality
    console.log(`User action: ${action} for ${otherUser?.full_name}`);
  };

  const renderStatusText = () => {
    if (isOnline) {
      return <span className="text-green-500 text-xs">Online</span>;
    } else if (lastSeen) {
      return <span className="text-muted-foreground text-xs">{lastSeen}</span>;
    }
    return null;
  };

  return (
    <div className="flex items-center flex-1 justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="h-9 w-9">
          <AvatarImage src={otherUser?.avatar_url || ''} alt={otherUser?.full_name || 'User'} />
          <AvatarFallback className={getAvatarColor(otherUser?.id || '')}>
            {getInitials(otherUser?.full_name || 'User')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <div className="font-medium flex items-center gap-1">
            {otherUser?.full_name}
            
            {isOnline && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            )}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground gap-1.5">
            {listing && (
              <span className="truncate max-w-[150px]">
                {listing.title}
              </span>
            )}
            
            {listing && listing.price && (
              <Badge variant="outline" className="font-normal text-[10px]">
                ₹{listing.price.toLocaleString()}
              </Badge>
            )}
          </div>
          
          {renderStatusText()}
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleUserAction('favorite')}>
              <Star className="mr-2 h-4 w-4" />
              <span>Add to favorites</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUserAction('report')}>
              <Flag className="mr-2 h-4 w-4" />
              <span>Report user</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUserAction('block')}>
              <Ban className="mr-2 h-4 w-4" />
              <span>Block user</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

import { useState } from "react";

export default HeaderUserInfo;
