
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, Plus, ListOrdered, Heart, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MobileNavigationProps {
  onChatOpen: () => void;
}

const MobileNavigation = ({ onChatOpen }: MobileNavigationProps) => {
  const [showSellOptions, setShowSellOptions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSellClick = () => {
    setShowSellOptions(true);
  };

  const navigateToSell = (path: string) => {
    setShowSellOptions(false);
    navigate(path);
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-between px-4 py-2 z-50">
        <Link to="/" className="flex flex-col items-center gap-1">
          <Home className={`h-6 w-6 ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link to="/q" className="flex flex-col items-center gap-1">
          <Video className={`h-6 w-6 ${location.pathname === '/q' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="text-xs">Q</span>
        </Link>
        
        <button
          onClick={handleSellClick}
          className="flex flex-col items-center -mt-8"
        >
          <div className="bg-primary rounded-full p-4 shadow-lg">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs mt-1">Sell Now</span>
        </button>
        
        <Link to="/my-ads" className="flex flex-col items-center gap-1">
          <ListOrdered className={`h-6 w-6 ${location.pathname === '/my-ads' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="text-xs">My Ads</span>
        </Link>
        
        <Link to="/wishlist" className="flex flex-col items-center gap-1">
          <Heart className={`h-6 w-6 ${location.pathname === '/wishlist' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="text-xs">Wishlist</span>
        </Link>
      </div>

      <Dialog open={showSellOptions} onOpenChange={setShowSellOptions}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-center">What do you want to sell?</DialogTitle>
          <div className="flex flex-col gap-4 mt-4">
            <Button 
              onClick={() => navigateToSell('/sell')}
              className="flex items-center gap-2 h-16"
            >
              <div className="bg-primary/10 p-2 rounded-full">
                <ListOrdered className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Post Ad</h3>
                <p className="text-sm text-muted-foreground">Sell with photos and details</p>
              </div>
            </Button>
            
            <Button 
              onClick={() => navigateToSell('/sell/q')}
              className="flex items-center gap-2 h-16"
              variant="outline"
            >
              <div className="bg-secondary/10 p-2 rounded-full">
                <Video className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Q Video</h3>
                <p className="text-sm text-muted-foreground">Sell with a short video</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileNavigation;
