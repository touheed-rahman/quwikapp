
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface StatusTabsProps {
  selectedTab: string;
}

const StatusTabs = ({ selectedTab }: StatusTabsProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // If no tab is explicitly selected in URL, redirect to approved tab
  useEffect(() => {
    if (!searchParams.get('tab')) {
      navigate('?tab=approved', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="px-4 pt-2 w-full">
      <TabsList className="w-full grid grid-cols-4 gap-2 h-auto p-1 bg-secondary/50 border border-primary/10 rounded-xl">
        <TabsTrigger 
          value="pending" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white w-full text-sm font-medium px-2 py-2 rounded-lg"
        >
          PENDING
        </TabsTrigger>
        <TabsTrigger 
          value="approved" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white w-full text-sm font-medium px-2 py-2 rounded-lg"
        >
          ONLINE
        </TabsTrigger>
        <TabsTrigger 
          value="rejected" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white w-full text-sm font-medium px-2 py-2 rounded-lg"
        >
          REJECTED
        </TabsTrigger>
        <TabsTrigger 
          value="sold" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white w-full text-sm font-medium px-2 py-2 rounded-lg"
        >
          SOLD
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default StatusTabs;
