
import React from "react";
import { 
  PieChart, 
  LayoutDashboard, 
  ListFilter, 
  Users, 
  Settings, 
  Bell,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    },
    {
      id: "providers",
      label: "Service Providers",
      icon: Layers
    }
  ];

  return (
    <nav className="flex items-center md:space-x-6 overflow-x-auto pb-2 md:pb-0 px-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md relative whitespace-nowrap",
            currentTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <tab.icon className="h-4 w-4 mr-2" />
          {tab.label}
          {tab.count ? (
            <span className="ml-2 rounded-full bg-destructive w-5 h-5 flex items-center justify-center text-xs text-white">
              {tab.count}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  );
};

export default AdminNavTabs;
