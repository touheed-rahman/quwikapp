
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
  Activity,
} from "lucide-react";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import ListingManagement from "@/components/admin/ListingManagement";
import UserManagement from "@/components/admin/UserManagement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Check if there's a filter passed from dashboard metrics
  useEffect(() => {
    if (location.state?.filter) {
      if (location.state.filter === 'users') {
        setActiveTab('users');
      } else {
        setActiveTab('listings');
      }
    }
  }, [location.state]);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b py-2 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Quwik Admin</h1>
            </div>
            
            <div className="flex items-center">
              <TabsList className="bg-muted/60">
                <TabsTrigger 
                  value="dashboard" 
                  onClick={() => setActiveTab('dashboard')}
                  className={activeTab === 'dashboard' ? 'bg-white' : ''}
                >
                  <Gauge className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="listings" 
                  onClick={() => setActiveTab('listings')}
                  className={activeTab === 'listings' ? 'bg-white' : ''}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Listings</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="users" 
                  onClick={() => setActiveTab('users')}
                  className={activeTab === 'users' ? 'bg-white' : ''}
                >
                  <Users className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="analytics" 
                  onClick={() => setActiveTab('analytics')}
                  className={activeTab === 'analytics' ? 'bg-white' : ''}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="ml-4 flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-foreground hover:text-foreground gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex pt-16 flex-grow">
        {/* Main content */}
        <motion.div 
          className="flex-1 p-4 md:p-6 transition-all duration-300 container mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'listings' && 'Manage Listings'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'analytics' && 'Analytics & Reports'}
              {activeTab === 'notifications' && 'Notification Center'}
              {activeTab === 'settings' && 'Admin Settings'}
            </h1>
            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-sm">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">System Online</span>
            </div>
          </Card>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
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
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
