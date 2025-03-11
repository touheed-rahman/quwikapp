
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
  ArrowRight
} from "lucide-react";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import ListingManagement from "@/components/admin/ListingManagement";
import UserManagement from "@/components/admin/UserManagement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  useEffect(() => {
    // Handle window resize for mobile responsiveness
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
      <div className="bg-white shadow-sm border-b h-16 fixed top-0 left-0 right-0 z-50 flex items-center px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold hidden md:block">Quwik Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
      
      <div className="flex pt-16 flex-grow">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              className="w-64 bg-white shadow-md h-[calc(100vh-4rem)] fixed left-0 top-16 z-40 overflow-y-auto"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="p-4">
                <div className="space-y-1 mt-2">
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
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main content */}
        <motion.div 
          className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}
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
