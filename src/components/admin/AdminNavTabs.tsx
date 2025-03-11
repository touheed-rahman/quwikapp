
import { Button } from "@/components/ui/button";
import { 
  HomeIcon, 
  ListIcon, 
  UserIcon, 
  AreaChartIcon, 
  ArrowLeftIcon,
  SparklesIcon 
} from "lucide-react";

interface AdminNavTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showBackButton?: boolean;
}

export default function AdminNavTabs({ 
  activeTab, 
  setActiveTab,
  showBackButton = false
}: AdminNavTabsProps) {
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleBackToDashboard = () => {
    setActiveTab('dashboard');
  };

  return (
    <div className="hidden md:flex space-x-2 lg:space-x-4 items-center">
      {showBackButton && (
        <Button
          variant="outline"
          size="sm"
          className="mr-2"
          onClick={handleBackToDashboard}
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Dashboard
        </Button>
      )}

      {!showBackButton && (
        <>
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('dashboard')}
            className="flex items-center"
          >
            <HomeIcon className="h-4 w-4 mr-1" />
            Dashboard
          </Button>

          <Button
            variant={activeTab === 'listings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('listings')}
            className="flex items-center"
          >
            <ListIcon className="h-4 w-4 mr-1" />
            Listings
          </Button>

          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('users')}
            className="flex items-center"
          >
            <UserIcon className="h-4 w-4 mr-1" />
            Users
          </Button>

          <Button
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('analytics')}
            className="flex items-center"
          >
            <AreaChartIcon className="h-4 w-4 mr-1" />
            Analytics
          </Button>
          
          <Button
            variant={activeTab === 'features' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('features')}
            className="flex items-center"
          >
            <SparklesIcon className="h-4 w-4 mr-1" />
            Features
          </Button>
        </>
      )}
    </div>
  );
}
