import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavTabs from "@/components/admin/AdminNavTabs";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import ListingManagement from "@/components/admin/ListingManagement";
import UserManagement from "@/components/admin/UserManagement";
import AdminContentHeader from "@/components/admin/AdminContentHeader";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdvancedAnalytics from "@/components/admin/AdvancedAnalytics";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [userData, setUserData] = useState({
    name: "Admin User",
    avatar: "",
  });

  useEffect(() => {
    if (location.state?.tab) {
      setCurrentTab(location.state.tab);
    }
  }, [location.state]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel.",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate("/admin/login");
          return;
        }
        
        const { data: adminData, error } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        
        if (error || !adminData) {
          toast({
            title: "Access denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
        
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", session.user.id)
          .single();
        
        if (profileData) {
          setUserData({
            name: profileData.full_name || "Admin User",
            avatar: profileData.avatar_url || "",
          });
        }
        
        setIsAdmin(true);
        
        const { data: notificationData } = await supabase
          .from("notifications")
          .select("count")
          .eq("user_id", session.user.id)
          .single();
          
        if (notificationData) {
          setNotifications(notificationData.count || 0);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate, toast]);

  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setCurrentTab(e.detail);
    };
    
    window.addEventListener('adminTabChange', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('adminTabChange', handleTabChange as EventListener);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-pulse">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <div className="flex h-screen items-center justify-center">Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        handleLogout={handleLogout} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        userAvatar={userData.avatar}
        userName={userData.name} 
      />
      
      <AdminMobileMenu 
        isOpen={isMobileMenuOpen} 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setIsMobileMenuOpen(false);
        }}
        notificationCount={notifications}
      />
      
      <motion.main 
        className="container max-w-7xl mx-auto px-4 py-6 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AdminContentHeader activeTab={currentTab} />
        
        <div className="mt-6">
          <AdminNavTabs 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab} 
            notificationCount={notifications} 
          />
        </div>
        
        <motion.div 
          className="mt-6"
          key={currentTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentTab === "dashboard" && <DashboardMetrics />}
          {currentTab === "analytics" && <AdvancedAnalytics />}
          {currentTab === "listings" && <ListingManagement />}
          {currentTab === "users" && <UserManagement />}
          {currentTab === "notifications" && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">New listing submission</h3>
                        <p className="text-sm text-gray-500">A new product listing requires your approval</p>
                      </div>
                      <Button className="w-full sm:w-auto">Mark as Read</Button>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">2 hours ago</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentTab === "settings" && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Site Configuration</h3>
                  <p className="text-sm text-gray-500 mb-4">Adjust global site settings</p>
                  <Button className="w-full sm:w-auto">Manage Settings</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">User Permissions</h3>
                  <p className="text-sm text-gray-500 mb-4">Manage admin access and roles</p>
                  <Button className="w-full sm:w-auto">Manage Permissions</Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.main>
    </div>
  );
};

export default AdminPanel;
