
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatusTabsProps {
  selectedTab: string;
}

const StatusTabs = ({ selectedTab }: StatusTabsProps) => {
  return (
    <div className="px-4 pt-2 w-full">
      <TabsList className="w-full grid grid-cols-4 gap-2 h-auto p-1">
        <TabsTrigger 
          value="pending" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white w-full"
        >
          UNDER REVIEW
        </TabsTrigger>
        <TabsTrigger 
          value="approved" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white w-full"
        >
          ONLINE
        </TabsTrigger>
        <TabsTrigger 
          value="rejected" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white w-full"
        >
          REJECTED
        </TabsTrigger>
        <TabsTrigger 
          value="sold" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white w-full"
        >
          SOLD
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default StatusTabs;
