
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, UserCheck, UserPlus } from "lucide-react";

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

const SellerProfileHeader = ({
  profile,
  isFollowing,
  currentUserId,
  profileId,
  handleFollow,
  isMobile,
}: SellerProfileHeaderProps) => {
  return (
    <Card className="p-6 mb-8 shadow-md hover:shadow-lg transition-shadow duration-200">
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

            <div className="flex items-center justify-center md:justify-start gap-6 pt-2">
              <span className="text-sm">
                <strong className="text-foreground">{profile.followers_count || 0}</strong>
                <span className="text-muted-foreground ml-1">followers</span>
              </span>
              <span className="text-sm">
                <strong className="text-foreground">{profile.following_count || 0}</strong>
                <span className="text-muted-foreground ml-1">following</span>
              </span>
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
