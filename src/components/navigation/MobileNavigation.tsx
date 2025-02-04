
import { Link } from "react-router-dom";
import { Home, MessageSquare, Plus, ListOrdered, Heart } from "lucide-react";

interface MobileNavigationProps {
  onChatOpen: () => void;
}

const MobileNavigation = ({ onChatOpen }: MobileNavigationProps) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-between px-6 py-2 z-50">
      <Link to="/" className="flex flex-col items-center gap-1">
        <Home className="h-6 w-6 text-primary" />
        <span className="text-xs">Home</span>
      </Link>
      <button 
        onClick={onChatOpen}
        className="flex flex-col items-center gap-1"
      >
        <MessageSquare className="h-6 w-6 text-muted-foreground hover:text-white transition-colors" />
        <span className="text-xs hover:text-white transition-colors">Chats</span>
      </button>
      <Link
        to="/sell"
        className="flex flex-col items-center -mt-8"
      >
        <div className="bg-primary rounded-full p-4 shadow-lg">
          <Plus className="h-6 w-6 text-white" />
        </div>
        <span className="text-xs mt-1">Sell Now</span>
      </Link>
      <Link to="/my-ads" className="flex flex-col items-center gap-1">
        <ListOrdered className="h-6 w-6 text-muted-foreground hover:text-white transition-colors" />
        <span className="text-xs hover:text-white transition-colors">My Ads</span>
      </Link>
      <Link to="/wishlist" className="flex flex-col items-center gap-1">
        <Heart className="h-6 w-6 text-muted-foreground hover:text-white transition-colors" />
        <span className="text-xs hover:text-white transition-colors">Wishlist</span>
      </Link>
    </div>
  );
};

export default MobileNavigation;
