
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

// Import refactored components
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavTabs from "@/components/admin/AdminNavTabs";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";
import AdminContentHeader from "@/components/admin/AdminContentHeader";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import ListingManagement from "@/components/admin/ListingManagement";
import UserManagement from "@/components/admin/UserManagement";

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

  // Listen for custom event to change tabs
  useEffect(() => {
    const handleTabChange = (event: CustomEvent<string>) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('adminTabChange', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('adminTabChange', handleTabChange as EventListener);
    };
  }, []);

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

  // Determine if we should show the back button
  const shouldShowBackButton = activeTab !== 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navbar */}
      <AdminHeader handleLogout={handleLogout} />
      
      <div className="flex items-center absolute left-4 top-0 h-16 md:relative md:left-0 md:top-0">
        <AdminMobileMenu activeTab={activeTab} setActiveTab={setActiveTab} />
        <AdminNavTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          showBackButton={shouldShowBackButton}
        />
      </div>
      
      {/* Main content */}
      <motion.div 
        className="flex-1 p-4 md:p-6 transition-all duration-300 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AdminContentHeader activeTab={activeTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
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
                <AdminAnalytics />
              </TabsContent>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
