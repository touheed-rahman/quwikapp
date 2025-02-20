
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filter: 'all' | 'buying' | 'selling';
  onFilterChange: (filter: 'all' | 'buying' | 'selling') => void;
}

export const ChatFilters = ({ 
  activeTab, 
  setActiveTab,
  filter,
  onFilterChange
}: ChatFiltersProps) => {
  return (
    <div className="px-4 pt-2">
      <Tabs value={filter} onValueChange={(value: any) => onFilterChange(value)}>
        <TabsList className="w-full justify-start gap-2 h-auto p-1">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-primary/90 data-[state=active]:text-white hover:text-white flex-1"
          >
            ALL
          </TabsTrigger>
          <TabsTrigger 
            value="buying"
            className="data-[state=active]:bg-primary/90 data-[state=active]:text-white hover:text-white flex-1"
          >
            BUYING
          </TabsTrigger>
          <TabsTrigger 
            value="selling"
            className="data-[state=active]:bg-primary/90 data-[state=active]:text-white hover:text-white flex-1"
          >
            SELLING
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
