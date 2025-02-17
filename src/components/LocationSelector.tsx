
import { useState, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Location } from './location/types';
import LocationList from './location/LocationList';
import { useToast } from './ui/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const LocationSelector = ({ value, onChange }: { value: string | null, onChange: (value: string | null) => void }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCityName = useCallback((locationString: string) => {
    if (!locationString) return '';
    return locationString.split('|')[0];
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setLocations([]);
      return;
    }

    setLoading(true);
    try {
      const { data: cities, error } = await supabase
        .from('indian_cities')
        .select('*')
        .or(`name.ilike.%${query}%,area.ilike.%${query}%,state.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;

      const formattedLocations: Location[] = (cities || []).map(city => ({
        id: city.id,
        name: city.name,
        area: city.area,
        state: city.state,
        latitude: city.latitude,
        longitude: city.longitude
      }));

      setLocations(formattedLocations);
    } catch (error) {
      console.error('Error searching locations:', error);
      toast({
        title: "Error",
        description: "Could not fetch locations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleSearchDebounced = useCallback((value: string) => {
    setSearchQuery(value);
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [handleSearch]);

  const handleLocationChoice = useCallback(async (location: Location) => {
    try {
      const newValue = `${location.name}|${location.latitude}|${location.longitude}|${location.id}`;
      onChange(newValue);
      setOpen(false);
      setSearchQuery('');
      setLocations([]);
    } catch (error) {
      console.error('Error selecting location:', error);
      toast({
        title: "Error",
        description: "Could not process location selection. Please try again.",
        variant: "destructive",
      });
    }
  }, [onChange, toast]);

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
            placeholder="Search cities..." 
            value={searchQuery}
            onValueChange={handleSearchDebounced}
            className="border-b border-input/50"
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>
                <Loader2 className="h-4 w-4 animate-spin text-purple-500 mx-auto" />
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Searching locations...
                </p>
              </CommandEmpty>
            ) : locations.length === 0 ? (
              <CommandEmpty>No cities found.</CommandEmpty>
            ) : (
              <LocationList
                locations={locations}
                loading={loading}
                searchQuery={searchQuery}
                selectedValue={value?.split('|')[3]}
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
