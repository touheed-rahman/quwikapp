import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, UserCheck, UserPlus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface SellerProfileHeaderProps {
  profile: {
    full_name: string;
    created_at: string;
    location?: string;
    followers_count: number;
    following_count: number;
  };
  isFollowing: boolean;
  currentUserId: string | null;
  profileId: string;
  handleFollow: () => void;
  isMobile: boolean;
}

const FollowersList = ({ profileId }: { profileId: string }) => {
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

const FollowingList = ({ profileId }: { profileId: string }) => {
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

const SellerProfileHeader = ({
  profile,
  isFollowing,
  currentUserId,
  profileId,
  handleFollow,
  isMobile,
}: SellerProfileHeaderProps) => {
  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-2 ring-primary/10">
            <AvatarFallback className="text-3xl md:text-4xl bg-primary/5">
              {profile.full_name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center md:text-left space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {profile.full_name}
            </h1>
            
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-muted-foreground">
              <div className="flex items-center justify-center md:justify-start gap-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Member since {new Date(profile.created_at).getFullYear()}
                </span>
              </div>
              {profile.location && (
                <div className="flex items-center justify-center md:justify-start gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <strong>{profile.followers_count || 0}</strong>
                    <span className="text-muted-foreground">followers</span>
                    <Users className="h-4 w-4 ml-1 text-muted-foreground" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Followers</DialogTitle>
                  </DialogHeader>
                  <FollowersList profileId={profileId} />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <strong>{profile.following_count || 0}</strong>
                    <span className="text-muted-foreground">following</span>
                    <Users className="h-4 w-4 ml-1 text-muted-foreground" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Following</DialogTitle>
                  </DialogHeader>
                  <FollowingList profileId={profileId} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        {currentUserId !== profileId && (
          <Button
            onClick={handleFollow}
            variant={isFollowing ? "outline" : "default"}
            className="w-full md:w-auto"
            size={isMobile ? "lg" : "default"}
          >
            {isFollowing ? (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Follow
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SellerProfileHeader;
