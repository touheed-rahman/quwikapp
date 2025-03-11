
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  HomeIcon, 
  ListIcon, 
  UserIcon, 
  AreaChartIcon, 
  MenuIcon,
  SparklesIcon
} from "lucide-react";

interface AdminMobileMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminMobileMenu({ activeTab, setActiveTab }: AdminMobileMenuProps) {
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle>Admin Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 py-4">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('dashboard')}
            className="justify-start"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'listings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('listings')}
            className="justify-start"
          >
            <ListIcon className="h-4 w-4 mr-2" />
            Listings
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('users')}
            className="justify-start"
          >
            <UserIcon className="h-4 w-4 mr-2" />
            Users
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('analytics')}
            className="justify-start"
          >
            <AreaChartIcon className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant={activeTab === 'features' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTabChange('features')}
            className="justify-start"
          >
            <SparklesIcon className="h-4 w-4 mr-2" />
            Features
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
