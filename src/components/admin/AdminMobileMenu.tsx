
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Info, List, Menu, ShoppingCart, Star, Users2, Watch, Wrench } from "lucide-react";

type AdminMobileMenuProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const AdminMobileMenu = ({ activeTab, setActiveTab }: AdminMobileMenuProps) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Info className="h-4 w-4" />,
    },
    {
      id: 'listings',
      label: 'Listings',
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users2 className="h-4 w-4" />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <Star className="h-4 w-4" />,
    },
    {
      id: 'service-leads',
      label: 'Service Leads',
      icon: <List className="h-4 w-4" />,
    },
    {
      id: 'service-center',
      label: 'Service Center',
      icon: <Wrench className="h-4 w-4" />,
    },
  ];

  const getActiveLabel = () => {
    const item = menuItems.find(item => item.id === activeTab);
    return item ? item.label : 'Dashboard';
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Admin Navigation</SheetTitle>
        </SheetHeader>
        <div className="grid gap-2 py-4">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="justify-start gap-2"
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileMenu;
