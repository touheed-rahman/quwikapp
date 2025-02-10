
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

  return (
    <CommandGroup>
      {locations.map((location) => (
        <CommandItem
          key={location.id}
          value={location.id}
          onSelect={() => onSelect(location)}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              (location.area 
                ? `${location.name}, ${location.area}` === selectedValue
                : location.name === selectedValue)
                ? "opacity-100"
                : "opacity-0"
            )}
          />
          <div className="flex flex-col">
            <span className="font-medium">{location.name}</span>
            {location.area && (
              <span className="text-sm text-muted-foreground">{location.area}</span>
            )}
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default LocationList;
