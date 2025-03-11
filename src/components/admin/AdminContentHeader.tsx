
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowUpDown, Filter, UserCheck, Package, ShoppingCart, Users, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminContentHeaderProps {
  activeTab: string;
}

const AdminContentHeader = ({ activeTab }: AdminContentHeaderProps) => {
  // Choose the appropriate icon based on the active tab
  const getHeaderIcon = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ArrowUpDown className="h-6 w-6 text-primary mr-2" />;
      case 'listings':
        return <Package className="h-6 w-6 text-primary mr-2" />;
      case 'users':
        return <Users className="h-6 w-6 text-primary mr-2" />;
      case 'analytics':
        return <ShoppingCart className="h-6 w-6 text-primary mr-2" />;
      default:
        return <UserCheck className="h-6 w-6 text-primary mr-2" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getHeaderIcon()}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'listings' && 'Manage Listings'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'analytics' && 'Analytics & Reports'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {activeTab !== 'dashboard' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2 bg-primary/5 text-primary hover:bg-primary/10"
                onClick={() => window.location.href = '/admin'}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            )}
            
            <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full flex items-center">
              <Filter className="h-3.5 w-3.5 mr-1" />
              <span>Filters</span>
            </div>
            
            <div className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
              System Status: Online
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AdminContentHeader;
