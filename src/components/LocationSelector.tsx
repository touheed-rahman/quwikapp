
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

  // Parse the value string to get place_id
  const selectedPlaceId = value?.split('|')[1];

  // Find the selected location using place_id
  const selectedLocation = selectedPlaceId
    ? locations?.find(location => location.place_id === selectedPlaceId)
    : null;

  // Function to shorten area name
  const shortenArea = (area: string) => {
    if (!area) return '';
    const parts = area.split(',');
    return parts[0].trim();
  };

  const handleLocationChoice = async (location: Location) => {
    try {
      const locationDetails = await handleLocationSelect(location);
      if (locationDetails) {
        const shortenedArea = shortenArea(locationDetails.area || '');
        // Format: "LocationName, ShortenedArea|place_id"
        const newValue = `${locationDetails.name}${shortenedArea ? `, ${shortenedArea}` : ''}|${locationDetails.place_id}`;
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

  const displayLocation = () => {
    if (selectedLocation) {
      const area = shortenArea(selectedLocation.area || '');
      return area ? `${selectedLocation.name}, ${area}` : selectedLocation.name;
    }
    if (value) {
      const parts = value.split('|')[0].split(',');
      return parts[0].trim();
    }
    return "Select location";
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
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{displayLocation()}</span>
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
                selectedValue={selectedPlaceId}
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

