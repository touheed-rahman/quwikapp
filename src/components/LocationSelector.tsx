
import { useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Location, LocationSelectorProps } from './location/types';
import { useLocationSearch } from './location/useLocationSearch';
import LocationList from './location/LocationList';
import { useToast } from './ui/use-toast';
import { cn } from '@/lib/utils';

const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { locations, loading, handleLocationSelect } = useLocationSearch(searchQuery);
  const { toast } = useToast();

  // Extract just the city name from the location string
  const getCityName = useCallback((locationString: string) => {
    if (!locationString) return '';
    const parts = locationString.split(',')[0].split('|')[0];
    return parts.trim();
  }, []);

  const handleLocationChoice = useCallback(async (location: Location) => {
    try {
      const locationDetails = await handleLocationSelect(location);
      if (locationDetails) {
        const cityName = getCityName(locationDetails.name);
        const newValue = `${cityName}|${locationDetails.place_id}`;
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
  }, [getCityName, handleLocationSelect, onChange, toast]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-muted-foreground hover:text-foreground border-input",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "transition-colors duration-200"
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{value ? getCityName(value) : "Select location"}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] p-0 shadow-lg border border-input/50 bg-white" 
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command className="rounded-lg border-none">
          <CommandInput 
            placeholder="Search location..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="border-b border-input/50"
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
                selectedValue={value?.split('|')[1]}
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
