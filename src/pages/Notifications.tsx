
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, MessageSquare, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type SystemNotification = {
  id: string;
  type: 'message' | 'listing_approved' | 'listing_rejected' | 'system';
  title: string;
  content: string;
  read: boolean;
  created_at: string;
  metadata: any;
}

const NotificationIcon = ({ type }: { type: SystemNotification['type'] }) => {
  switch (type) {
    case 'message':
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'listing_approved':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'listing_rejected':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const Notifications = () => {
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user);
    });
  }, []);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', sessionUser?.id],
    queryFn: async () => {
      if (!sessionUser?.id) return [];
      
      const { data, error } = await supabase
        .from('system_notifications')
        .select('*')
        .eq('user_id', sessionUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }

      return data as SystemNotification[];
    },
    enabled: !!sessionUser?.id,
  });

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('system_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (!sessionUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-20">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
            <p className="text-muted-foreground">Please sign in to view your notifications</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
          
          <ScrollArea className="h-[70vh] w-full rounded-md border">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 transition-colors ${
                      !notification.read ? 'bg-muted/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      <NotificationIcon type={notification.type} />
                      <div className="flex-1">
                        <h3 className="font-medium leading-none mb-2">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground">{notification.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
