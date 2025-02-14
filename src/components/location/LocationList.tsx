
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
  const shortenArea = (area: string) => {
    if (!area) return '';
    const parts = area.split(',');
    return parts[0].trim();
  };

  return (
    <CommandGroup className="max-h-[300px] overflow-y-auto">
      {locations.map((location) => (
        <CommandItem
          key={location.place_id}
          value={location.place_id}
          onSelect={() => onSelect(location)}
          className={cn(
            "flex items-start gap-2 p-3 cursor-pointer",
            "hover:bg-primary/90 hover:text-primary-foreground",
            "data-[selected=true]:bg-primary/90 data-[selected=true]:text-primary-foreground",
            "transition-colors duration-200"
          )}
          data-selected={location.place_id === selectedValue}
        >
          <Check
            className={cn(
              "h-4 w-4 mt-1 shrink-0",
              location.place_id === selectedValue
                ? "opacity-100"
                : "opacity-0"
            )}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-base truncate">
              {location.name}
            </span>
            {location.area && (
              <span className="text-sm opacity-90 truncate">
                {shortenArea(location.area)}
              </span>
            )}
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default LocationList;
