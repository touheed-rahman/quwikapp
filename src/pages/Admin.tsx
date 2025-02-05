import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import ListingManagement from "@/components/admin/ListingManagement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/profile');
        return;
      }

      const { data: adminData, error } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !adminData) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto p-4 pt-8">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        <div className="space-y-8">
          <DashboardMetrics />
          <div>
            <h2 className="text-lg font-semibold mb-4">Listing Management</h2>
            <ListingManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;