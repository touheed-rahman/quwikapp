
import { Gauge, LayoutGrid, Users, BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AdminMobileMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminMobileMenu = ({ activeTab, setActiveTab }: AdminMobileMenuProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 space-y-1">
              <Button 
                variant={activeTab === 'dashboard' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => handleTabChange('dashboard')}
              >
                <Gauge className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
              
              <Button 
                variant={activeTab === 'listings' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => handleTabChange('listings')}
              >
                <LayoutGrid className="w-5 h-5 mr-2" />
                Listings
              </Button>
              
              <Button 
                variant={activeTab === 'users' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => handleTabChange('users')}
              >
                <Users className="w-5 h-5 mr-2" />
                Users
              </Button>
              
              <Button 
                variant={activeTab === 'analytics' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium"
                onClick={() => handleTabChange('analytics')}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Analytics
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminMobileMenu;
