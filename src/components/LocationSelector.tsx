
import { useState, useCallback, useEffect } from 'react';
import { MapPin, Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Location, State, City, Country } from './location/types';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const LocationSelector = ({ value, onChange }: { value: string | null, onChange: (value: string | null) => void }) => {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState<'country' | 'state' | 'city'>('country');
  const { toast } = useToast();

  const getLocationName = useCallback((locationString: string) => {
    if (!locationString) return '';
    const parts = locationString.split('|');
    if (parts.length >= 3) {
      return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
    }
    return locationString;
  }, []);

  const loadCountries = useCallback(async () => {
    setLoading(true);
    try {
      const { data: countriesData, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) throw error;
      setCountries(countriesData || []);
      setLevel('country');
    } catch (error) {
      console.error('Error loading countries:', error);
      toast({
        title: "Error",
        description: "Could not load countries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadStates = useCallback(async (countryId: string) => {
    setLoading(true);
    try {
      const { data: statesData, error } = await supabase
        .from('states')
        .select('*')
        .eq('country_id', countryId)
        .order('name');

      if (error) throw error;
      setStates(statesData || []);
      setLevel('state');
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
      const { data: citiesData, error } = await supabase
        .from('cities')
        .select('*')
        .eq('state_id', stateId)
        .order('name');

      if (error) throw error;

      // Filter out duplicates (like Bangalore if Bengaluru exists)
      const filteredCities = citiesData?.filter(city => 
        city.name !== 'Bangalore' || !citiesData.some(c => c.name === 'Bengaluru')
      ) || [];

      setCities(filteredCities);
      setLevel('city');
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

  const handleCountrySelect = useCallback(async (country: Country) => {
    setSelectedCountry(country);
    await loadStates(country.id);
  }, [loadStates]);

  const handleStateSelect = useCallback(async (state: State) => {
    setSelectedState(state);
    await loadCities(state.id);
  }, [loadCities]);

  const handleCitySelect = useCallback((city: City) => {
    if (!selectedState || !selectedCountry) return;
    
    const locationString = `${city.name}|${selectedState.name}|${selectedCountry.name}|${city.latitude}|${city.longitude}|${city.id}|${selectedState.id}|${selectedCountry.id}`;
    onChange(locationString);
    setOpen(false);
    resetSelections();
  }, [selectedState, selectedCountry, onChange]);

  const resetSelections = () => {
    setCities([]);
    setStates([]);
    setSelectedState(null);
    setSelectedCountry(null);
    setLevel('country');
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) {
        loadCountries();
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
          <CommandList className="max-h-[300px] overflow-y-auto">
            {loading ? (
              <CommandEmpty>
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Loading...
                </p>
              </CommandEmpty>
            ) : level === 'city' ? (
              <>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal hover:bg-primary hover:text-white"
                    onClick={() => {
                      setSelectedState(null);
                      setCities([]);
                      setLevel('state');
                      if (selectedCountry) {
                        loadStates(selectedCountry.id);
                      }
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to States in {selectedCountry?.name}
                  </Button>
                </div>
                <div className="py-2">
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
              </>
            ) : level === 'state' ? (
              <>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal hover:bg-primary hover:text-white"
                    onClick={() => {
                      setSelectedCountry(null);
                      setStates([]);
                      setLevel('country');
                      loadCountries();
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Countries
                  </Button>
                </div>
                <div className="py-2">
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
              </>
            ) : (
              <div className="py-2">
                {countries.map((country) => (
                  <div
                    key={country.id}
                    className="px-2 py-1.5 cursor-pointer hover:bg-primary hover:text-white flex items-center justify-between"
                    onClick={() => handleCountrySelect(country)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{country.name}</span>
                      <span className="text-xs text-muted-foreground">{country.code}</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                ))}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
