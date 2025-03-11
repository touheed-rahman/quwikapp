
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { UserRound, Edit, LogOut, ShoppingBag, Heart, ShieldCheck, Store } from "lucide-react";

interface ProfileSidebarProps {
  profile: any;
  handleLogout: () => Promise<void>;
}

const ProfileSidebar = ({ profile, handleLogout }: ProfileSidebarProps) => {
  return (
    <Card className="p-6 space-y-6 border-primary/10 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
            <UserRound className="w-12 h-12 text-primary" />
          </div>
          <Button 
            size="icon" 
            className="absolute bottom-0 right-0 rounded-full w-8 h-8 bg-primary hover:bg-primary/90"
          >
            <Edit className="h-4 w-4 text-white" />
          </Button>
        </div>
        <h2 className="mt-4 font-semibold text-lg">{profile?.full_name}</h2>
        <p className="text-sm text-muted-foreground">{profile?.email}</p>
      </div>
      
      <div className="space-y-2">
        <Link to="/wishlist">
          <Button variant="ghost" className="w-full justify-start pl-3 hover:bg-primary/10 hover:text-primary transition-colors" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Saved Items
          </Button>
        </Link>
        
        <Link to={`/seller/${profile?.id}`}>
          <Button variant="ghost" className="w-full justify-start pl-3 hover:bg-primary/10 hover:text-primary transition-colors" size="sm">
            <Store className="h-4 w-4 mr-2" />
            Seller Profile
          </Button>
        </Link>
        
        <Link to="/my-orders">
          <Button variant="ghost" className="w-full justify-start pl-3 hover:bg-primary/10 hover:text-primary transition-colors" size="sm">
            <ShoppingBag className="h-4 w-4 mr-2" />
            My Orders
          </Button>
        </Link>
        
        {profile?.isAdmin && (
          <Link to="/admin">
            <Button variant="ghost" className="w-full justify-start pl-3 hover:bg-primary/10 hover:text-primary transition-colors" size="sm">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          </Link>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full justify-start pl-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors" 
          size="sm" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </Card>
  );
};

export default ProfileSidebar;
