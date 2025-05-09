
import { LayoutDashboard, PieChart, ListFilter, Users, Bell, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AdminMobileMenuProps {
  isOpen: boolean;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  notificationCount?: number;
}

const AdminMobileMenu = ({ 
  isOpen, 
  currentTab, 
  setCurrentTab, 
  notificationCount = 3 
}: AdminMobileMenuProps) => {
  const { toast } = useToast();

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    
    toast({
      title: "Tab Changed",
      description: `You're now viewing the ${tab} section`,
      duration: 2000,
    });
  };
  
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: { type: "info", text: "Overview" }
    },
    {
      id: "analytics",
      label: "Analytics", 
      icon: PieChart,
      badge: { type: "info", text: "Reports" }
    },
    {
      id: "listings",
      label: "Listings",
      icon: ListFilter,
      badge: { type: "count", value: 12 }
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      badge: { type: "count", value: 6 }
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: { type: "count", value: notificationCount }
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 md:hidden border-b border-primary/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-3 space-y-1">
            {menuItems.map((item) => (
              <Button 
                key={item.id}
                variant={currentTab === item.id ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium rounded-lg h-12"
                onClick={() => handleTabChange(item.id)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
                
                {item.badge?.type === "info" && (
                  <div className="ml-auto bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge.text}
                  </div>
                )}
                
                {item.badge?.type === "count" && (
                  <Badge className="ml-auto bg-amber-500/90 hover:bg-amber-500 text-white">
                    {item.badge.value}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminMobileMenu;
