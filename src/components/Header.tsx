
import { Bell, MessageSquare, User, HelpCircle, ListOrdered } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "./ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatWindow from "@/components/chat/ChatWindow";
import FeedbackDialog from "@/components/feedback/FeedbackDialog";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const [session, setSession] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) return;

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

    const channel = supabase
      .channel('notifications')
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
  }, [session?.user]);

  const handleNotificationClick = () => {
    toast({
      title: "Coming Soon",
      description: "Notifications feature will be available soon!",
      duration: 3000,
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="shrink-0">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Quwik
          </h1>
        </Link>

        <div className="flex items-center gap-2 ml-auto">
          {session ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hidden md:flex flex-col items-center justify-center h-16 w-16 gap-0.5 hover:bg-gray-100 text-foreground"
                onClick={handleNotificationClick}
              >
                <Bell className="h-5 w-5 text-foreground" />
                <span className="text-[10px] text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute top-2 right-2 h-5 w-5 flex items-center justify-center bg-destructive hover:bg-destructive p-0 text-white"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <div className="relative hidden md:block">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsChatOpen(true)}
                  className="flex flex-col items-center justify-center h-16 w-16 gap-0.5 hover:bg-gray-100 text-foreground"
                >
                  <MessageSquare className="h-5 w-5 text-foreground" />
                  <span className="text-[10px] text-foreground">Chats</span>
                </Button>
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute top-2 right-2 h-5 w-5 flex items-center justify-center bg-destructive hover:bg-destructive p-0 text-white"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <Link to="/my-ads" className="hidden md:block">
                <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center h-16 w-16 gap-0.5 hover:bg-gray-100 text-foreground">
                  <ListOrdered className="h-5 w-5 text-foreground" />
                  <span className="text-[10px] text-foreground">My Ads</span>
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center h-16 w-16 gap-0.5 hover:bg-gray-100 text-foreground">
                  <User className="h-5 w-5 text-foreground" />
                  <span className="text-[10px] text-foreground">Profile</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsFeedbackOpen(true)}
                className="flex flex-col items-center justify-center h-16 w-16 gap-0.5 hover:bg-gray-100 text-foreground"
              >
                <HelpCircle className="h-5 w-5 text-foreground" />
                <span className="text-[10px] text-foreground">Help</span>
              </Button>
              <Link to="/sell" className="hidden md:block shrink-0">
                <Button className="bg-primary hover:bg-primary/90 text-white">Sell Now</Button>
              </Link>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsFeedbackOpen(true)}
                className="flex flex-col items-center justify-center h-16 w-16 gap-0.5 hover:bg-gray-100 text-foreground"
              >
                <HelpCircle className="h-5 w-5 text-foreground" />
                <span className="text-[10px] text-foreground">Help</span>
              </Button>
              <Link to="/profile">
                <Button className="bg-primary hover:bg-primary/90 text-white">Sign In</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 bg-black/20 z-50">
          <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
      )}

      <FeedbackDialog 
        open={isFeedbackOpen} 
        onOpenChange={setIsFeedbackOpen} 
      />
    </header>
  );
};

export default Header;
