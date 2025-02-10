
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Location, LocationSelectorProps } from './location/types';
import { useLocationSearch } from './location/useLocationSearch';
import LocationList from './location/LocationList';
import { useToast } from './ui/use-toast';

const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { locations, loading, handleLocationSelect } = useLocationSearch(searchQuery);
  const { toast } = useToast();

  const selectedLocation = value && locations?.length 
    ? locations.find(location => 
        location.area 
          ? `${location.name}, ${location.area}` === value
          : location.name === value
      )
    : null;

  const handleLocationChoice = async (location: Location) => {
    try {
      const locationDetails = await handleLocationSelect(location);
      if (locationDetails) {
        const newValue = locationDetails.area 
          ? `${locationDetails.name}, ${locationDetails.area}`
          : locationDetails.name;
        onChange(newValue);
        setOpen(false);
        setSearchQuery('');
      } else {
        toast({
          title: "Error",
          description: "Could not fetch location details. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error selecting location:', error);
      toast({
        title: "Error",
        description: "Could not process location selection. Please try again.",
        variant: "destructive",
      });
    }
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
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading locations...</CommandEmpty>
            ) : locations?.length === 0 ? (
              <CommandEmpty>No locations found.</CommandEmpty>
            ) : (
              <LocationList
                locations={locations}
                loading={loading}
                searchQuery={searchQuery}
                selectedValue={value}
                onSelect={handleLocationChoice}
              />
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
