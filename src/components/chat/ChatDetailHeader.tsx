
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConversationDetails } from "./types/chat-detail";
import HeaderUserInfo from "./HeaderUserInfo";

interface ChatDetailHeaderProps {
  conversationDetails: ConversationDetails | null;
  onBack: () => void;
  isOnline?: boolean;
  sessionUserId?: string | null;
}

const ChatDetailHeader = ({ 
  conversationDetails, 
  onBack,
  isOnline = false,
  sessionUserId
}: ChatDetailHeaderProps) => {
  // If we don't have conversation details, show a minimal header
  if (!conversationDetails) {
    return (
      <header className="border-b p-4 flex items-center gap-3 bg-background/95 backdrop-blur sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-sm">Loading conversation...</div>
      </header>
    );
  }

  return (
    <header className="border-b p-4 flex items-center gap-3 bg-background/95 backdrop-blur sticky top-0 z-10">
      <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <HeaderUserInfo 
        conversationDetails={conversationDetails} 
        isOnline={isOnline} 
        sessionUserId={sessionUserId} 
      />
    </header>
  );
};

export default ChatDetailHeader;
