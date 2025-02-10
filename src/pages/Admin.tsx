
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import ListingManagement from "@/components/admin/ListingManagement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/admin/login');
          return;
        }

        const { data: isAdmin, error: fnError } = await supabase
          .rpc('is_admin', { user_uid: user.id });

        if (fnError || !isAdmin) {
          console.error('Error checking admin status:', fnError);
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel",
            variant: "destructive"
          });
          navigate('/admin/login');
          return;
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        navigate('/admin/login');
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel"
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const selectedFilter = location.state?.filter || 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto p-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="space-y-8">
          <DashboardMetrics />
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {selectedFilter === 'all' && 'All Listings'}
              {selectedFilter === 'pending' && 'Pending Listings'}
              {selectedFilter === 'approved' && 'Approved Listings'}
              {selectedFilter === 'rejected' && 'Rejected Listings'}
              {selectedFilter === 'featured' && 'Featured Listings'}
              {selectedFilter === 'users' && 'User Management'}
            </h2>
            <ListingManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

