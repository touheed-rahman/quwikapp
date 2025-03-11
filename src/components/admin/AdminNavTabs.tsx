
import { Gauge, LayoutGrid, Users, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface AdminNavTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNavTabs = ({ activeTab, setActiveTab }: AdminNavTabsProps) => {
  return (
    <div className="hidden md:flex items-center space-x-1 ml-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-primary/10 p-1 rounded-lg border border-primary/20 shadow-sm">
          <TabsTrigger 
            value="dashboard" 
            className={`${activeTab === 'dashboard' ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/5'} px-4 py-2.5 transition-all duration-200 rounded-md flex items-center gap-2`}
          >
            <Gauge className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="listings" 
            className={`${activeTab === 'listings' ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/5'} px-4 py-2.5 transition-all duration-200 rounded-md flex items-center gap-2`}
          >
            <LayoutGrid className="w-4 h-4" />
            Listings
          </TabsTrigger>
          <TabsTrigger 
            value="users" 
            className={`${activeTab === 'users' ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/5'} px-4 py-2.5 transition-all duration-200 rounded-md flex items-center gap-2`}
          >
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className={`${activeTab === 'analytics' ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/5'} px-4 py-2.5 transition-all duration-200 rounded-md flex items-center gap-2`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AdminNavTabs;
