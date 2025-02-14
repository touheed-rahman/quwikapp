import { CommandGroup, CommandItem } from "@/components/ui/command";
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Location } from './types';

interface LocationListProps {
  locations: Location[];
  loading: boolean;
  searchQuery: string;
  selectedValue: string | null;
  onSelect: (location: Location) => void;
}

const LocationList = ({ locations, selectedValue, onSelect }: LocationListProps) => {
  if (!locations || locations.length === 0) {
    return null;
  }

  // Function to shorten area name
  const shortenArea = (area: string) => area?.split(',')[0]?.trim() || '';

  return (
    <CommandGroup className="max-h-[300px] overflow-y-auto">
      {locations.map((location) => (
        <CommandItem
          key={location.area}
          value={location.area}
          onSelect={() => onSelect(location)}
          className={cn(
            "flex items-start gap-2 p-3 cursor-pointer",
            location.area === selectedValue ? "bg-primary/90 text-primary-foreground" : "",
            "hover:bg-primary/80 hover:text-primary-foreground transition-colors"
          )}
        >
          <Check className={cn("h-4 w-4", location.area === selectedValue ? "opacity-100" : "opacity-0")} />
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-base truncate">{location.name}</span>
            <span className="text-sm text-muted-foreground truncate">
            {shortenArea(location.area.replace(/\/chj\w+/g, ''))}
            </span>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
  
};

export default LocationList;
