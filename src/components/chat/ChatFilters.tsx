
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ChatFiltersProps {
  filter: 'all' | 'buying' | 'selling';
  onFilterChange: (filter: 'all' | 'buying' | 'selling') => void;
  unreadCounts?: {
    all: number;
    buying: number;
    selling: number;
  };
}

export const ChatFilters = ({ 
  filter,
  onFilterChange,
  unreadCounts = { all: 0, buying: 0, selling: 0 }
}: ChatFiltersProps) => {
  return (
    <div className="px-4 pt-2">
      <Tabs value={filter} onValueChange={(value: 'all' | 'buying' | 'selling') => onFilterChange(value)}>
        <TabsList className="w-full justify-start gap-2 h-auto p-1">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-primary/90 data-[state=active]:text-white hover:text-white flex-1 relative"
          >
            ALL
            {unreadCounts.all > 0 && (
              <Badge variant="default" className="bg-primary ml-1 absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center rounded-full text-[10px]">
                {unreadCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="buying"
            className="data-[state=active]:bg-primary/90 data-[state=active]:text-white hover:text-white flex-1 relative"
          >
            BUYING
            {unreadCounts.buying > 0 && (
              <Badge variant="default" className="bg-primary ml-1 absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center rounded-full text-[10px]">
                {unreadCounts.buying}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="selling"
            className="data-[state=active]:bg-primary/90 data-[state=active]:text-white hover:text-white flex-1 relative"
          >
            SELLING
            {unreadCounts.selling > 0 && (
              <Badge variant="default" className="bg-primary ml-1 absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center rounded-full text-[10px]">
                {unreadCounts.selling}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
