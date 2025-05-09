
import React from "react";
import { 
  PieChart, 
  LayoutDashboard, 
  ListFilter, 
  Users, 
  Settings, 
  Bell,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface AdminNavTabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  notificationCount?: number;
}

const AdminNavTabs = ({ currentTab, setCurrentTab, notificationCount = 0 }: AdminNavTabsProps) => {
  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview of all activities"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: PieChart,
      description: "Data insights & reports"
    },
    {
      id: "listings",
      label: "Listings",
      icon: ListFilter,
      description: "Manage product listings"
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      description: "User management"
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      count: notificationCount,
      description: "System alerts & messages"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "System configuration"
    }
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg p-1">
      <nav className="flex items-center md:space-x-1 overflow-x-auto pb-2 md:pb-0 px-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-md relative whitespace-nowrap transition-all group",
              currentTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <tab.icon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{tab.label}</span>
              
              {tab.count ? (
                <span className="ml-2 rounded-full bg-destructive w-5 h-5 flex items-center justify-center text-xs text-white">
                  {tab.count}
                </span>
              ) : null}
            </div>
            
            {/* Tooltip that appears on hover with more description */}
            <span className={cn(
              "absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap",
              "group-hover:opacity-100"
            )}>
              {tab.description}
            </span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default AdminNavTabs;
