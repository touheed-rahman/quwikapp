
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatusTabsProps {
  selectedTab: string;
}

const StatusTabs = ({ selectedTab }: StatusTabsProps) => {
  return (
    <div className="px-4 pt-2">
      <TabsList className="w-full justify-start gap-2 h-auto p-1">
        <TabsTrigger 
          value="pending" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white flex-1"
        >
          UNDER REVIEW
        </TabsTrigger>
        <TabsTrigger 
          value="approved" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white flex-1"
        >
          ONLINE
        </TabsTrigger>
        <TabsTrigger 
          value="rejected" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white flex-1"
        >
          REJECTED
        </TabsTrigger>
        <TabsTrigger 
          value="sold" 
          className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white flex-1"
        >
          SOLD
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default StatusTabs;
