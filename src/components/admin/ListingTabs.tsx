
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Clock, CheckCircle, XCircle, Star } from "lucide-react";

interface ListingTabsProps {
  currentFilter: string;
}

const ListingTabs = ({ currentFilter }: ListingTabsProps) => {
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    navigate('/admin', { state: { filter: value } });
  };

  return (
    <div className="w-full mb-4">
      <Tabs value={currentFilter} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-secondary/30 border border-primary/10 rounded-xl">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm md:text-base font-medium px-2 py-3 rounded-lg flex items-center justify-center gap-1.5"
          >
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">All Listings</span>
            <span className="sm:hidden">All</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="pending" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm md:text-base font-medium px-2 py-3 rounded-lg flex items-center justify-center gap-1.5"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Pending</span>
            <span className="sm:hidden">Pending</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="approved" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm md:text-base font-medium px-2 py-3 rounded-lg flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Approved</span>
            <span className="sm:hidden">Approved</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="rejected" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm md:text-base font-medium px-2 py-3 rounded-lg flex items-center justify-center gap-1.5"
          >
            <XCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Rejected</span>
            <span className="sm:hidden">Rejected</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="featured" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm md:text-base font-medium px-2 py-3 rounded-lg flex items-center justify-center gap-1.5"
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Featured</span>
            <span className="sm:hidden">Featured</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ListingTabs;
