
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatusTabsProps {
  selectedTab: string;
}

const StatusTabs = ({ selectedTab }: StatusTabsProps) => {
  return (
    <TabsList className="mb-8">
      <TabsTrigger value="pending">Under Review</TabsTrigger>
      <TabsTrigger value="approved">Online</TabsTrigger>
      <TabsTrigger value="rejected">Rejected</TabsTrigger>
      <TabsTrigger value="sold">Sold</TabsTrigger>
    </TabsList>
  );
};

export default StatusTabs;
