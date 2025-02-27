
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface FollowersListProps {
  profileId: string;
}

const FollowersList = ({ profileId }: FollowersListProps) => {
  const [followers, setFollowers] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const { data } = await supabase
        .from('follows')
        .select(`
          follower:profiles!follows_follower_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('following_id', profileId);

      if (data) {
        setFollowers(data.map(item => item.follower));
      }
    };

    fetchFollowers();

    const channel = supabase
      .channel('followers')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'follows',
          filter: `following_id=eq.${profileId}`
        }, 
        () => {
          fetchFollowers();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [profileId]);

  return (
    <ScrollArea className="h-[300px] pr-4">
      {followers.map((follower) => (
        <Link
          key={follower.id}
          to={`/seller/${follower.id}`}
          className="flex items-center gap-3 py-2 hover:bg-accent rounded-lg px-2 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>{follower.full_name[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{follower.full_name}</span>
        </Link>
      ))}
      {followers.length === 0 && (
        <p className="text-center text-muted-foreground py-4">No followers yet</p>
      )}
    </ScrollArea>
  );
};

export default FollowersList;
