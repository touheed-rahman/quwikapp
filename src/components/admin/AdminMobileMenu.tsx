
import { Gauge, LayoutGrid, Users, BarChart3, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface AdminMobileMenuProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isOpen?: boolean; 
  currentTab?: string;
  setCurrentTab?: (tab: string) => void;
}

const AdminMobileMenu = ({ activeTab, setActiveTab, isOpen, currentTab, setCurrentTab }: AdminMobileMenuProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use provided state or fallback to internal state
  const menuOpen = isOpen !== undefined ? isOpen : mobileMenuOpen;
  const currentActiveTab = currentTab || activeTab;
  
  const handleTabChange = (tab: string) => {
    if (setCurrentTab) {
      setCurrentTab(tab);
    } else if (setActiveTab) {
      setActiveTab(tab);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Button 
        variant={menuOpen ? "default" : "ghost"} 
        size="icon" 
        className="md:hidden relative"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <Menu className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 bg-primary text-[10px] h-4 w-4 flex items-center justify-center p-0">
              4
            </Badge>
          </>
        )}
      </Button>
      
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 md:hidden border-b border-primary/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 space-y-1">
              <Button 
                variant={currentActiveTab === 'dashboard' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium rounded-lg h-12"
                onClick={() => handleTabChange('dashboard')}
              >
                <Gauge className="w-5 h-5 mr-3" />
                Dashboard
                <div className="ml-auto bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                  Overview
                </div>
              </Button>
              
              <Button 
                variant={currentActiveTab === 'listings' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium rounded-lg h-12"
                onClick={() => handleTabChange('listings')}
              >
                <LayoutGrid className="w-5 h-5 mr-3" />
                Listings
                <Badge className="ml-auto bg-amber-500/90 hover:bg-amber-500 text-white">12</Badge>
              </Button>
              
              <Button 
                variant={currentActiveTab === 'users' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium rounded-lg h-12"
                onClick={() => handleTabChange('users')}
              >
                <Users className="w-5 h-5 mr-3" />
                Users
                <Badge className="ml-auto bg-green-500/90 hover:bg-green-500 text-white">6</Badge>
              </Button>
              
              <Button 
                variant={currentActiveTab === 'analytics' ? "default" : "ghost"} 
                className="w-full justify-start text-base font-medium rounded-lg h-12"
                onClick={() => handleTabChange('analytics')}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Analytics
                <div className="ml-auto bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                  Reports
                </div>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminMobileMenu;
