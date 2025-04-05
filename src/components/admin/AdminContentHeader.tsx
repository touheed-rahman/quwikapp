
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowUpDown, Filter, UserCheck, Package, ShoppingCart, Users, Star, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface AdminContentHeaderProps {
  activeTab?: string;
}

const AdminContentHeader = ({ activeTab = 'dashboard' }: AdminContentHeaderProps) => {
  const navigate = useNavigate();
  
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
      <Card className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            {getHeaderIcon()}
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'listings' && 'Manage Listings'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'analytics' && 'Analytics & Reports'}
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {activeTab !== 'dashboard' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/20 flex items-center gap-1.5"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/20"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-1.5" />
              Main Site
            </Button>
            
            <Badge className="bg-green-100 text-green-700 border border-green-200 hover:bg-green-200">
              System: Online
            </Badge>
          </div>
        </div>
        
        {/* Breadcrumb path */}
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <span>Admin</span>
          <span className="mx-1.5">/</span>
          <span className="text-primary font-medium capitalize">{activeTab}</span>
          {activeTab === 'listings' && (
            <>
              <span className="mx-1.5">/</span>
              <span>All Listings</span>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default AdminContentHeader;
