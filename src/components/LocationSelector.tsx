
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Location, LocationSelectorProps } from './location/types';
import { useLocationSearch } from './location/useLocationSearch';
import LocationList from './location/LocationList';

const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { locations, loading } = useLocationSearch(searchQuery);

  const selectedLocation = value 
    ? locations.find(location => 
        location.area 
          ? `${location.name}, ${location.area}` === value
          : location.name === value
      )
    : null;

  const handleLocationSelect = (location: Location) => {
    const newValue = location.area 
      ? `${location.name}, ${location.area}`
      : location.name;
    onChange(newValue);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground hover:text-foreground"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4" />
            {selectedLocation ? (
              <span className="truncate">
                {selectedLocation.area 
                  ? `${selectedLocation.name}, ${selectedLocation.area}`
                  : selectedLocation.name}
              </span>
            ) : (
              "Select location"
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search location..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <LocationList
            locations={locations}
            loading={loading}
            searchQuery={searchQuery}
            selectedValue={value}
            onSelect={handleLocationSelect}
          />
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
