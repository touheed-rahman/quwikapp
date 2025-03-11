
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SellerProfileHeaderProps {
  profile: {
    id: string;
    full_name: string;
    created_at: string;
    location?: string;
    followers_count: number;
    following_count: number;
    avatar_url?: string;
  };
  isFollowing: boolean;
  currentUserId: string | null;
  profileId: string;
  handleFollow: () => void;
  isMobile: boolean;
}

const SellerProfileHeader = ({
  profile: initialProfile,
  isFollowing,
  currentUserId,
  profileId,
  handleFollow,
  isMobile,
}: SellerProfileHeaderProps) => {
  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${profileId}`,
        },
        (payload: any) => {
          if (payload.new) {
            setProfile(prev => ({
              ...prev,
              followers_count: payload.new.followers_count,
              following_count: payload.new.following_count
            }));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [profileId]);

  // Function to get profile picture URL from Supabase storage
  const getProfilePictureUrl = () => {
    if (profile?.avatar_url) {
      return supabase.storage.from('profiles').getPublicUrl(profile.avatar_url).data.publicUrl;
    }
    return null;
  };

  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-2 ring-primary/10">
            {getProfilePictureUrl() ? (
              <AvatarImage src={getProfilePictureUrl()} alt={profile.full_name} />
            ) : null}
            <AvatarFallback className="text-3xl md:text-4xl bg-primary/5">
              {profile.full_name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center md:text-left space-y-4 mt-2">
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
                  <Button variant="ghost" size="sm" className="gap-1 text-foreground hover:text-foreground">
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
                  <Button variant="ghost" size="sm" className="gap-1 text-foreground hover:text-foreground">
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
            className="w-full md:w-auto text-primary-foreground hover:text-primary-foreground"
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
