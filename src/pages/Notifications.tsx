
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { BellRing, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import MobileNavigation from "@/components/navigation/MobileNavigation";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  created_at: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Get user session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        // Fetch all notifications
        const { data, error } = await supabase
          .from('listing_notifications')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setNotifications(data || []);
        
        // Mark all as read
        await supabase
          .from('listing_notifications')
          .update({ read: true })
          .eq('user_id', session.user.id)
          .eq('read', false);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch notifications"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('listing-notifications-page')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listing_notifications'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as Notification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleOpenChat = () => {
    // This will be handled by the parent component that passes the onChatOpen prop
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BellRing className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Listing Notifications</h2>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="py-8 text-center">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No notifications yet
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    !notification.read ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm">{notification.message}</p>
                    {notification.read && (
                      <span className="text-xs text-primary flex items-center space-x-1">
                        <Check className="h-3 w-3" />
                        <span>Read</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </main>
      <MobileNavigation onChatOpen={handleOpenChat} />
    </div>
  );
};

export default Notifications;
