
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Shield, 
  LogOut, 
  Users, 
  LayoutGrid, 
  Bell, 
  Settings, 
  Gauge, 
  BarChart3,
  Activity
} from "lucide-react";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import ListingManagement from "@/components/admin/ListingManagement";
import UserManagement from "@/components/admin/UserManagement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <motion.div 
          className="w-64 bg-white shadow-md h-screen fixed left-0 top-0 z-30"
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold">Quwik Admin</h1>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2 mt-6">
              <Button 
                variant={activeTab === 'dashboard' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => setActiveTab('dashboard')}
              >
                <Gauge className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
              
              <Button 
                variant={activeTab === 'listings' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => setActiveTab('listings')}
              >
                <LayoutGrid className="w-5 h-5 mr-2" />
                Listings
              </Button>
              
              <Button 
                variant={activeTab === 'users' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => setActiveTab('users')}
              >
                <Users className="w-5 h-5 mr-2" />
                Users
              </Button>
              
              <Button 
                variant={activeTab === 'analytics' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Analytics
              </Button>
              
              <Button 
                variant={activeTab === 'notifications' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </Button>
              
              <Button 
                variant={activeTab === 'settings' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2 w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </motion.div>
        
        {/* Main content */}
        <motion.div 
          className="ml-64 flex-1 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'listings' && 'Manage Listings'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'analytics' && 'Analytics & Reports'}
                {activeTab === 'notifications' && 'Notification Center'}
                {activeTab === 'settings' && 'Admin Settings'}
              </h1>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-500">System Online</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'dashboard' && <DashboardMetrics />}
            
            {activeTab === 'listings' && <ListingManagement />}
            
            {activeTab === 'users' && <UserManagement />}
            
            {activeTab === 'analytics' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
                <p className="text-muted-foreground">Detailed analytics coming soon...</p>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">System Notifications</h2>
                <p className="text-muted-foreground">Notification management coming soon...</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
