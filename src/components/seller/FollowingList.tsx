
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

interface FollowingListProps {
  profileId: string;
}

const FollowingList = ({ profileId }: FollowingListProps) => {
  const [following, setFollowing] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      const { data } = await supabase
        .from('follows')
        .select(`
          following:profiles!follows_following_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('follower_id', profileId);

      if (data) {
        setFollowing(data.map(item => item.following));
      }
    };

    fetchFollowing();

    const channel = supabase
      .channel('following')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'follows',
          filter: `follower_id=eq.${profileId}`
        }, 
        () => {
          fetchFollowing();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [profileId]);

  return (
    <ScrollArea className="h-[300px] pr-4">
      {following.map((user) => (
        <Link
          key={user.id}
          to={`/seller/${user.id}`}
          className="flex items-center gap-3 py-2 hover:bg-accent rounded-lg px-2 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.full_name[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.full_name}</span>
        </Link>
      ))}
      {following.length === 0 && (
        <p className="text-center text-muted-foreground py-4">Not following anyone</p>
      )}
    </ScrollArea>
  );
};

export default FollowingList;
