
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Clock, CheckCircle, XCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ListingTabsProps {
  currentFilter: string;
}

const ListingTabs = ({ currentFilter }: ListingTabsProps) => {
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    navigate('/admin', { state: { filter: value } });
  };

  // Define mock count values for each tab
  const tabCounts = {
    all: 32,
    pending: 8,
    approved: 18,
    rejected: 3,
    featured: 3
  };

  return (
    <motion.div 
      className="w-full mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Tabs value={currentFilter} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-primary/5 border border-primary/10 rounded-xl shadow-sm">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md text-sm md:text-base font-medium px-2 py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">All</span>
            <Badge className={`${currentFilter === 'all' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-muted'} ml-1`}>
              {tabCounts.all}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger 
            value="pending" 
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md text-sm md:text-base font-medium px-2 py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Pending</span>
            <Badge className={`${currentFilter === 'pending' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-amber-100 text-amber-700'} ml-1`}>
              {tabCounts.pending}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger 
            value="approved" 
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md text-sm md:text-base font-medium px-2 py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Approved</span>
            <Badge className={`${currentFilter === 'approved' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-green-100 text-green-700'} ml-1`}>
              {tabCounts.approved}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger 
            value="rejected" 
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-md text-sm md:text-base font-medium px-2 py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <XCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Rejected</span>
            <Badge className={`${currentFilter === 'rejected' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-100 text-red-700'} ml-1`}>
              {tabCounts.rejected}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger 
            value="featured" 
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md text-sm md:text-base font-medium px-2 py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200"
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Featured</span>
            <Badge className={`${currentFilter === 'featured' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-purple-100 text-purple-700'} ml-1`}>
              {tabCounts.featured}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </motion.div>
  );
};

export default ListingTabs;
