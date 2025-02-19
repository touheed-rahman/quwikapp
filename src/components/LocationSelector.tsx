
import { useState, useCallback } from 'react';
import { MapPin, Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Location, State, City } from './location/types';
import { useToast } from './ui/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const LocationSelector = ({ value, onChange }: { value: string | null, onChange: (value: string | null) => void }) => {
  const [open, setOpen] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getLocationName = useCallback((locationString: string) => {
    if (!locationString) return '';
    const [city, state] = locationString.split('|');
    return `${city}, ${state}`;
  }, []);

  const loadStates = useCallback(async () => {
    setLoading(true);
    try {
      const { data: states, error } = await supabase
        .from('states')
        .select('*')
        .order('name');

      if (error) throw error;
      setStates(states || []);
    } catch (error) {
      console.error('Error loading states:', error);
      toast({
        title: "Error",
        description: "Could not load states. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadCities = useCallback(async (stateId: string) => {
    setLoading(true);
    try {
      const { data: cities, error } = await supabase
        .from('cities')
        .select('*')
        .eq('state_id', stateId)
        .neq('name', 'Bangalore') // Exclude Bangalore
        .order('name');

      if (error) throw error;
      setCities(cities || []);
    } catch (error) {
      console.error('Error loading cities:', error);
      toast({
        title: "Error",
        description: "Could not load cities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleStateSelect = useCallback(async (state: State) => {
    setSelectedState(state);
    await loadCities(state.id);
  }, [loadCities]);

  const handleCitySelect = useCallback((city: City) => {
    if (!selectedState) return;
    
    const locationString = `${city.name}|${selectedState.name}|${city.latitude}|${city.longitude}|${city.id}`;
    onChange(locationString);
    setOpen(false);
    setCities([]);
    setSelectedState(null);
  }, [selectedState, onChange]);

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) {
        loadStates();
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground hover:text-foreground ring-offset-background"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{value ? getLocationName(value) : "Select location"}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] p-0" 
        align="start"
      >
        <Command>
          <CommandInput 
            placeholder={selectedState ? "Search cities..." : "Search states..."} 
            readOnly={true}
            onTouchStart={(e) => {
              e.preventDefault();
              if (e.target instanceof HTMLInputElement) {
                e.target.blur();
              }
            }}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Loading...
                </p>
              </CommandEmpty>
            ) : selectedState ? (
              <>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal hover:bg-primary hover:text-white"
                    onClick={() => {
                      setSelectedState(null);
                      setCities([]);
                      loadStates();
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to States
                  </Button>
                </div>
                {cities.length === 0 ? (
                  <CommandEmpty>No cities found in {selectedState.name}</CommandEmpty>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto">
                    {cities.map((city) => (
                      <div
                        key={city.id}
                        className="px-2 py-1.5 cursor-pointer hover:bg-primary hover:text-white"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city.name}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {states.length === 0 ? (
                  <CommandEmpty>No states found</CommandEmpty>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto">
                    {states.map((state) => (
                      <div
                        key={state.id}
                        className="px-2 py-1.5 cursor-pointer hover:bg-primary hover:text-white flex items-center justify-between"
                        onClick={() => handleStateSelect(state)}
                      >
                        <span>{state.name}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
