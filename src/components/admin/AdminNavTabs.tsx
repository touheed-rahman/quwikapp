
import { Gauge, LayoutGrid, Users, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminNavTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNavTabs = ({ activeTab, setActiveTab }: AdminNavTabsProps) => {
  return (
    <div className="hidden md:flex items-center space-x-1 ml-8">
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
  );
};

export default AdminNavTabs;
