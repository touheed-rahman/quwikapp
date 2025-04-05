
import { Shield, LogOut, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AdminHeaderProps {
  handleLogout: () => Promise<void>;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

const AdminHeader = ({ handleLogout, isMobileMenuOpen, setIsMobileMenuOpen }: AdminHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b h-16 fixed top-0 left-0 right-0 z-50 flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Quwik Admin</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs">
            <Activity className="h-3 w-3" />
            <span>Online</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
