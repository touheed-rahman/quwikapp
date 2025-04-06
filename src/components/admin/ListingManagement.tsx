
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
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";

const ListingManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
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
    
    // Show confirmation toast
    toast({
      title: "Returned to Dashboard",
      description: "You're now viewing the dashboard overview",
    });
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToDashboard}
                className="flex items-center gap-1 text-primary h-8 bg-primary/5 hover:bg-primary/10 border-primary/20"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Return to the main dashboard view</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    
      <ListingTabs currentFilter={filter} />
      
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="w-full p-4 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
            <ListingSearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 w-full sm:w-auto bg-primary/5 text-primary hover:bg-primary/10 border-primary/20"
                      onClick={() => {
                        refetch();
                        toast({
                          title: "Refreshed",
                          description: "Listing data has been refreshed",
                        });
                      }}
                      aria-label="Refresh listings data"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh listing data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 w-full sm:w-auto bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                      aria-label="Add new listing"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Add New</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create a new listing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 w-full sm:w-auto"
                      aria-label="Export listings data"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export listings to CSV</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </Card>
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
          <Card className="border border-gray-100 shadow-sm overflow-hidden">
            <ListingTable 
              listings={filteredListings || []}
              onStatusUpdate={handleStatusUpdate}
              onFeaturedToggle={handleFeaturedToggle}
              onDelete={handleDelete}
            />
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ListingManagement;
