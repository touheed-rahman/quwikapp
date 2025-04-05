
import React from "react";
import { 
  PieChart, 
  LayoutDashboard, 
  ListFilter, 
  Users, 
  Settings, 
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
      icon: LayoutDashboard
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: PieChart
    },
    {
      id: "listings",
      label: "Listings",
      icon: ListFilter
    },
    {
      id: "users",
      label: "Users",
      icon: Users
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      count: notificationCount
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings
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
              "flex items-center px-4 py-2.5 text-sm font-medium rounded-md relative whitespace-nowrap transition-all",
              currentTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
            {tab.count ? (
              <span className="ml-2 rounded-full bg-destructive w-5 h-5 flex items-center justify-center text-xs text-white">
                {tab.count}
              </span>
            ) : null}
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default AdminNavTabs;
