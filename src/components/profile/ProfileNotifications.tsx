
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BellRing } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ListingNotification {
  id: string;
  message: string;
  read: boolean;
  created_at: string;
}

const ProfileNotifications = () => {
  const [notifications, setNotifications] = useState<ListingNotification[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('listing_notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setNotifications(data);
    };

    fetchNotifications();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('listing-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listing_notifications'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as ListingNotification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <BellRing className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
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
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(notification.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ProfileNotifications;
