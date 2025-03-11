
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, MessageSquare, Plus, ListOrdered, Heart, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSellOptions, setShowSellOptions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Fetch initial unread count
      const fetchUnreadCount = async () => {
        const { data, error } = await supabase
          .from('notifications')
          .select('unread_count')
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }

        const total = data.reduce((sum, notification) => sum + notification.unread_count, 0);
        setUnreadCount(total);
      };

      fetchUnreadCount();

      // Subscribe to notifications
      const channel = supabase
        .channel('notifications_mobile')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${session.user.id}`
          },
          () => {
            fetchUnreadCount();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    getSession();
  }, []);

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
        
        <div className="relative">
          <button 
            onClick={onChatOpen}
            className="flex flex-col items-center gap-1"
          >
            <MessageSquare className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            <span className="text-xs hover:text-primary transition-colors">Chats</span>
          </button>
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-destructive hover:bg-destructive p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
        
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
