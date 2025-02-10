
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ChatFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const filters = [
  { id: "all", label: "All" },
  { id: "meeting", label: "Meeting" },
  { id: "unread", label: "Unread" },
  { id: "important", label: "Important" }
];

export const ChatFilters = ({ activeFilter, setActiveFilter }: ChatFiltersProps) => {
  return (
    <>
      <Tabs defaultValue="all" className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="w-full justify-start gap-2 h-auto p-1">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white flex-1"
            >
              ALL
            </TabsTrigger>
            <TabsTrigger 
              value="buying"
              className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white flex-1"
            >
              BUYING
            </TabsTrigger>
            <TabsTrigger 
              value="selling"
              className="data-[state=active]:bg-primary data-[state=active]:text-white hover:text-white flex-1"
            >
              SELLING
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="px-4 pt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-full",
                activeFilter === filter.id 
                  ? "bg-primary/10 text-primary border-primary" 
                  : "hover:bg-primary/5 hover:text-white hover:border-primary"
              )}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </Tabs>
    </>
  );
};
