
import { MapPin, Bell, MessageSquare, User, HelpCircle, ListOrdered } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import LocationSelector from "./LocationSelector";
import { Badge } from "./ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatWindow from "@/components/chat/ChatWindow";

const Header = () => {
  const [session, setSession] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="shrink-0">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Quwik
          </h1>
        </Link>
        
        <div className="w-48 shrink-0 md:w-64">
          <LocationSelector 
            value={selectedLocation}
            onChange={setSelectedLocation}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {session ? (
            <>
              <Link to="/notifications" className="shrink-0">
                <Button variant="ghost" size="icon" className="relative hidden md:inline-flex">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-destructive hover:bg-destructive p-0"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <div className="relative hidden md:block shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsChatOpen(true)}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-destructive hover:bg-destructive p-0"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <Link to="/my-ads" className="hidden md:block shrink-0">
                <Button variant="ghost" size="icon">
                  <ListOrdered className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/profile" className="shrink-0">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/help" className="shrink-0">
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/sell" className="hidden md:block shrink-0">
                <Button className="hover:bg-primary hover:text-white whitespace-nowrap">Sell Now</Button>
              </Link>
            </>
          ) : (
            <Link to="/profile">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 bg-black/20 z-50">
          <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;

