
import { Link } from "react-router-dom";
import { Home, MessageSquare, Plus, ListOrdered, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface MobileNavigationProps {
  onChatOpen: () => void;
}

const MobileNavigation = ({ onChatOpen }: MobileNavigationProps) => {
  const [unreadCount, setUnreadCount] = useState(0);

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

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "Notifications feature will be available soon!",
      duration: 3000,
    });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-white border-t flex items-center justify-between px-6 py-2 z-50">
      <Link to="/" className="flex flex-col items-center gap-1">
        <Home className="h-6 w-6 text-white" />
        <span className="text-xs">Home</span>
      </Link>
      <div className="relative">
        <button 
          onClick={onChatOpen}
          className="flex flex-col items-center gap-1"
        >
          <MessageSquare className="h-6 w-6 text-white/80 hover:text-white transition-colors" />
          <span className="text-xs hover:text-white transition-colors">Chats</span>
        </button>
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-accent hover:bg-accent p-0"
          >
            {unreadCount}
          </Badge>
        )}
      </div>
      <Link
        to="/sell"
        className="flex flex-col items-center -mt-8"
      >
        <div className="bg-accent rounded-full p-4 shadow-lg">
          <Plus className="h-6 w-6 text-white" />
        </div>
        <span className="text-xs mt-1">Sell Now</span>
      </Link>
      <Link to="/my-ads" className="flex flex-col items-center gap-1">
        <ListOrdered className="h-6 w-6 text-white/80 hover:text-white transition-colors" />
        <span className="text-xs hover:text-white transition-colors">My Ads</span>
      </Link>
      <button onClick={handleNotificationClick} className="flex flex-col items-center gap-1">
        <Heart className="h-6 w-6 text-white/80 hover:text-white transition-colors" />
        <span className="text-xs hover:text-white transition-colors">Wishlist</span>
      </button>
    </div>
  );
};

export default MobileNavigation;
