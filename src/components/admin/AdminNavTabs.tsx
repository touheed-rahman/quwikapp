
import { ChevronLeft, Info, List, ShoppingCart, Star, Users2, Watch, Wrench } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

type AdminNavTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showBackButton?: boolean;
};

const AdminNavTabs = ({ activeTab, setActiveTab, showBackButton = false }: AdminNavTabsProps) => {
  const handleBackToDashboard = () => {
    setActiveTab('dashboard');
  };

  return (
    <div className="hidden md:flex items-center space-x-2">
      {showBackButton && (
        <Button 
          variant="ghost" 
          className="mr-2" 
          size="icon"
          onClick={handleBackToDashboard}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-fit"
      >
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <Info className="w-4 h-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          
          <TabsTrigger value="listings" className="flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            <span>Listings</span>
          </TabsTrigger>
          
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users2 className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          
          <TabsTrigger value="service-leads" className="flex items-center gap-1">
            <List className="w-4 h-4" />
            <span>Service Leads</span>
          </TabsTrigger>
          
          <TabsTrigger value="service-center" className="flex items-center gap-1">
            <Wrench className="w-4 h-4" />
            <span>Service Center</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AdminNavTabs;
