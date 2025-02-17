
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

  const shortenArea = (area: string) => {
    if (!area) return '';
    const parts = area.split(',');
    return parts[0].trim();
  };

  return (
    <CommandGroup className="max-h-[300px] overflow-y-auto">
      {locations.map((location) => (
        <CommandItem
          key={location.id}
          value={location.id}
          onSelect={() => onSelect(location)}
          className={cn(
            "flex items-start gap-2 p-3 cursor-pointer",
            "hover:bg-neutral-800/50 hover:text-purple-400",
            "data-[selected=true]:bg-purple-500/20 data-[selected=true]:text-purple-400",
            "transition-colors duration-200"
          )}
          data-selected={location.id === selectedValue}
        >
          <Check
            className={cn(
              "h-4 w-4 mt-1 shrink-0 text-purple-500",
              location.id === selectedValue
                ? "opacity-100"
                : "opacity-0"
            )}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-base truncate">
              {location.name}
            </span>
            {location.area && (
              <span className="text-sm text-muted-foreground truncate">
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
