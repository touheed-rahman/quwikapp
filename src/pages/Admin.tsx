
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
  Menu,
} from "lucide-react";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import ListingManagement from "@/components/admin/ListingManagement";
import UserManagement from "@/components/admin/UserManagement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Quwik Admin</h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1 ml-8">
            {/* Wrapping TabsList with Tabs component to fix the error */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-secondary/40 p-1 rounded-lg">
                <TabsTrigger 
                  value="dashboard" 
                  className={`${activeTab === 'dashboard' ? 'bg-primary text-white' : ''} px-4`}
                >
                  <Gauge className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="listings" 
                  className={`${activeTab === 'listings' ? 'bg-primary text-white' : ''} px-4`}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Listings
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className={`${activeTab === 'users' ? 'bg-primary text-white' : ''} px-4`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className={`${activeTab === 'analytics' ? 'bg-primary text-white' : ''} px-4`}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
      
      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 space-y-1">
              <Button 
                variant={activeTab === 'dashboard' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
              >
                <Gauge className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
              
              <Button 
                variant={activeTab === 'listings' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => {
                  setActiveTab('listings');
                  setMobileMenuOpen(false);
                }}
              >
                <LayoutGrid className="w-5 h-5 mr-2" />
                Listings
              </Button>
              
              <Button 
                variant={activeTab === 'users' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => {
                  setActiveTab('users');
                  setMobileMenuOpen(false);
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                Users
              </Button>
              
              <Button 
                variant={activeTab === 'analytics' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => {
                  setActiveTab('analytics');
                  setMobileMenuOpen(false);
                }}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Analytics
              </Button>
              
              <Button 
                variant={activeTab === 'notifications' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => {
                  setActiveTab('notifications');
                  setMobileMenuOpen(false);
                }}
              >
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </Button>
              
              <Button 
                variant={activeTab === 'settings' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => {
                  setActiveTab('settings');
                  setMobileMenuOpen(false);
                }}
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <motion.div 
        className="flex-1 p-4 md:p-6 transition-all duration-300 pt-20"
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
            {/* These TabsContent components should be within a Tabs component */}
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="dashboard">
                <DashboardMetrics />
              </TabsContent>
              
              <TabsContent value="listings">
                <ListingManagement />
              </TabsContent>
              
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="analytics">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
                  <p className="text-muted-foreground">Detailed analytics coming soon...</p>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">System Notifications</h2>
                  <p className="text-muted-foreground">Notification management coming soon...</p>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
                  <p className="text-muted-foreground">Settings panel coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
