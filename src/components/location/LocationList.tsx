
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
    <CommandGroup>
      {locations.map((location) => (
        <CommandItem
          key={location.place_id}
          value={location.place_id}
          onSelect={() => onSelect(location)}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              location.place_id === selectedValue
                ? "opacity-100"
                : "opacity-0"
            )}
          />
          <div className="flex flex-col">
            <span className="font-medium truncate">{location.name}</span>
            {location.area && (
              <span className="text-sm text-muted-foreground truncate">{shortenArea(location.area)}</span>
            )}
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default LocationList;

