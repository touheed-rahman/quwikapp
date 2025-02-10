
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Phone, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ConversationDetails } from "./types/chat-detail";

interface ChatDetailHeaderProps {
  conversationDetails: ConversationDetails | null;
}

const ChatDetailHeader = ({ conversationDetails }: ChatDetailHeaderProps) => {
  const navigate = useNavigate();

  if (!conversationDetails) return null;

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-white">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate(-1)}
        className="hover:bg-transparent md:hidden"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Avatar className="h-10 w-10">
        <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white">
          {conversationDetails.seller.full_name[0]}
        </div>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold truncate">{conversationDetails.seller.full_name}</span>
          <Badge variant="outline" className="h-5 bg-primary/10 text-primary border-primary shrink-0">
            Verified
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground truncate">{conversationDetails.listing.title}</span>
          <span className="text-sm font-medium shrink-0">₹{conversationDetails.listing.price}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatDetailHeader;

