
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavTabs from "@/components/admin/AdminNavTabs";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import ListingManagement from "@/components/admin/ListingManagement";
import UserManagement from "@/components/admin/UserManagement";
import AdminContentHeader from "@/components/admin/AdminContentHeader";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdvancedAnalytics from "@/components/admin/AdvancedAnalytics";
import { useToast } from "@/components/ui/use-toast";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);

  // Handle logout
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

  // Check if user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
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
        navigate("/");
        return;
      }
      
      setIsAdmin(true);
    };
    
    checkAdminStatus();
  }, [navigate]);

  // Listen for tab change events from child components
  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setCurrentTab(e.detail);
    };
    
    window.addEventListener('adminTabChange', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('adminTabChange', handleTabChange as EventListener);
    };
  }, []);

  if (!isAdmin) {
    return <div>Checking permissions...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        handleLogout={handleLogout} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      
      <AdminMobileMenu 
        isOpen={isMobileMenuOpen} 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setIsMobileMenuOpen(false);
        }} 
      />
      
      <main className="container max-w-7xl mx-auto px-4 py-6 pt-20">
        <AdminContentHeader activeTab={currentTab} />
        
        <div className="mt-6">
          <AdminNavTabs 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab} 
            notificationCount={notifications} 
          />
        </div>
        
        <div className="mt-6">
          {currentTab === "dashboard" && <DashboardMetrics />}
          {currentTab === "analytics" && <AdvancedAnalytics />}
          {currentTab === "listings" && <ListingManagement />}
          {currentTab === "users" && <UserManagement />}
          {currentTab === "notifications" && (
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>
              <p className="text-gray-500">Notification center coming soon.</p>
            </div>
          )}
          {currentTab === "settings" && (
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>
              <p className="text-gray-500">Settings panel coming soon.</p>
            </div>
          )}
          {currentTab === "providers" && (
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Service Providers</h2>
              <p className="text-gray-500">Service provider management coming soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
