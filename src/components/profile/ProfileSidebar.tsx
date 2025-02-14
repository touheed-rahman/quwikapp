
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { UserRound, Edit } from "lucide-react";

interface ProfileSidebarProps {
  profile: any;
  handleLogout: () => Promise<void>;
}

const ProfileSidebar = ({ profile, handleLogout }: ProfileSidebarProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <UserRound className="w-12 h-12 text-primary" />
          </div>
          <Button 
            size="icon" 
            className="absolute bottom-0 right-0 rounded-full w-8 h-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="mt-4 font-semibold text-lg">{profile?.full_name}</h2>
        <p className="text-sm text-muted-foreground">{profile?.email}</p>
      </div>
      
      <div className="space-y-1">
        <Link to="/wishlist">
          <Button variant="ghost" className="w-full justify-center" size="sm">
            Saved Items
          </Button>
        </Link>
        {profile?.isAdmin && (
          <Link to="/admin">
            <Button variant="ghost" className="w-full justify-center" size="sm">
              Admin Panel
            </Button>
          </Link>
        )}
        <Button 
          variant="ghost" 
          className="w-full justify-center text-red-600" 
          size="sm" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </Card>
  );
};

export default ProfileSidebar;
