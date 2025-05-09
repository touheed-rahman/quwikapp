
import { useLocation, useNavigate } from "react-router-dom";
import ListingSearchBar from "./ListingSearchBar";
import ListingTable from "./ListingTable";
import ListingTabs from "./ListingTabs";
import ListingLoader from "./ListingLoader";
import ListingError from "./ListingError";
import ListingEmpty from "./ListingEmpty";
import { useAdminListings } from "@/hooks/useAdminListings";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Upload, PlusCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ListingManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filter = location.state?.filter || 'all';
  const {
    filteredListings,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    handleStatusUpdate,
    handleFeaturedToggle,
    handleDelete,
    refetch
  } = useAdminListings(filter);

  const handleBackToDashboard = () => {
    // Navigate back to dashboard tab
    const event = new CustomEvent('adminTabChange', { detail: 'dashboard' });
    window.dispatchEvent(event);
  };

  if (error) {
    return <ListingError />;
  }

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToDashboard}
          className="flex items-center gap-1 text-primary h-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
      </motion.div>
    
      <ListingTabs currentFilter={filter} />
      
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ListingSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 w-full sm:w-auto bg-primary/5 text-primary hover:bg-primary/10 border-primary/20"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 w-full sm:w-auto bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add New</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </motion.div>

      {isLoading ? (
        <ListingLoader />
      ) : filteredListings?.length === 0 ? (
        <ListingEmpty />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ListingTable 
            listings={filteredListings || []}
            onStatusUpdate={handleStatusUpdate}
            onFeaturedToggle={handleFeaturedToggle}
            onDelete={handleDelete}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ListingManagement;
