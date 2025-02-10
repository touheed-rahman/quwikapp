
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UserRound, Mail, MapPin, Settings, Phone } from "lucide-react";

interface ProfileInformationProps {
  profile: any;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  setProfile: (profile: any) => void;
  handleUpdateProfile: () => Promise<void>;
}

const ProfileInformation = ({
  profile,
  isEditing,
  setIsEditing,
  setProfile,
  handleUpdateProfile,
}: ProfileInformationProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Profile Information</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <UserRound className="w-4 h-4" />
            Full Name
          </Label>
          <Input
            id="name"
            value={profile?.full_name || ''}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            disabled={!isEditing}
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={profile?.email || ''}
            disabled
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={profile?.phone || ''}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={!isEditing}
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </Label>
          <Input
            id="location"
            value={profile?.location || ''}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            disabled={!isEditing}
            className="bg-white"
          />
        </div>

        {isEditing && (
          <div className="pt-4">
            <Button 
              onClick={handleUpdateProfile}
              className="w-full"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileInformation;
