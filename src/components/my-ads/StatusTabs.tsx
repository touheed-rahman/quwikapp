
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatusTabsProps {
  selectedTab: string;
}

const StatusTabs = ({ selectedTab }: StatusTabsProps) => {
  return (
    <TabsList className="mb-8 w-full justify-start gap-2 h-auto bg-transparent">
      <TabsTrigger 
        value="pending" 
        className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white px-6"
      >
        Under Review
      </TabsTrigger>
      <TabsTrigger 
        value="approved" 
        className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white px-6"
      >
        Online
      </TabsTrigger>
      <TabsTrigger 
        value="rejected" 
        className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white px-6"
      >
        Rejected
      </TabsTrigger>
      <TabsTrigger 
        value="sold" 
        className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white px-6"
      >
        Sold
      </TabsTrigger>
    </TabsList>
  );
};

export default StatusTabs;
