
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
          key={location.place_id}
          value={location.name}
          onSelect={() => onSelect(location)}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              location.name === selectedValue
                ? "opacity-100"
                : "opacity-0"
            )}
          />
          <div className="flex flex-col">
            <span className="font-medium truncate">{location.name}</span>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default LocationList;
