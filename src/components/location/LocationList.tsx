
import { Check } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { Location } from "./types";

interface LocationListProps {
  locations: Location[];
  loading: boolean;
  searchQuery: string;
  selectedValue?: string;
  onSelect: (location: Location) => void;
}

const LocationList = ({
  locations,
  selectedValue,
  onSelect,
}: LocationListProps) => {
  return (
    <div className="mt-2">
      {locations.map((location) => (
        <CommandItem
          key={location.place_id}
          value={location.place_id}
          onSelect={() => onSelect(location)}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent"
        >
          <div className="flex-1">
            <div className="font-medium">{location.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {location.description}
            </div>
          </div>
          {selectedValue === location.place_id && (
            <Check className="h-4 w-4 text-primary shrink-0" />
          )}
        </CommandItem>
      ))}
    </div>
  );
};

export default LocationList;
