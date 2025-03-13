
import { useState, useCallback, useEffect } from 'react';
import { MapPin, Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LocationSelectorProps, Country, State, City } from './location/types';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

type SelectionLevel = 'country' | 'state' | 'city';

const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectionLevel, setSelectionLevel] = useState<SelectionLevel>('country');
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getLocationName = useCallback((locationString: string) => {
    if (!locationString) return '';
    const [city, state, lat, lng, cityId, countryName] = locationString.split('|');
    return countryName ? `${city}, ${state}, ${countryName}` : `${city}, ${state}`;
  }, []);

  const loadCountries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('id, name, code')
        .order('name');

      if (error) throw error;
      
      // Ensure we're setting data that matches the Country type
      const typedCountries: Country[] = data?.map(country => ({
        id: country.id,
        name: country.name,
        code: country.code
      })) || [];
      
      setCountries(typedCountries);
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

  const loadStates = useCallback(async (countryCode: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('states')
        .select('id, name, country_code')
        .eq('country_code', countryCode)
        .order('name');

      if (error) throw error;
      
      // Ensure we're setting data that matches the State type
      const typedStates: State[] = data?.map(state => ({
        id: state.id,
        name: state.name,
        country_code: state.country_code
      })) || [];
      
      setStates(typedStates);
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
      const { data, error } = await supabase
        .from('cities')
        .select('id, name, state_id, latitude, longitude')
        .eq('state_id', stateId)
        .order('name');

      if (error) throw error;

      // Filter out duplicates that might exist in the database
      // and ensure we're setting data that matches the City type
      const typedCities: City[] = data?.map(city => ({
        id: city.id,
        name: city.name,
        state_id: city.state_id,
        latitude: city.latitude || 0,
        longitude: city.longitude || 0
      })) || [];
      
      const uniqueCities = typedCities.filter((city, index, self) => 
        index === self.findIndex(c => c.name === city.name)
      );

      setCities(uniqueCities);
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
    setSelectionLevel('state');
    await loadStates(country.code);
  }, [loadStates]);

  const handleStateSelect = useCallback(async (state: State) => {
    setSelectedState(state);
    setSelectionLevel('city');
    await loadCities(state.id);
  }, [loadCities]);

  const handleCitySelect = useCallback((city: City) => {
    if (!selectedState || !selectedCountry) return;
    
    const locationString = `${city.name}|${selectedState.name}|${city.latitude}|${city.longitude}|${city.id}|${selectedCountry.name}`;
    onChange(locationString);
    setOpen(false);
    resetSelections();
  }, [selectedState, selectedCountry, onChange]);

  const resetSelections = useCallback(() => {
    setSelectionLevel('country');
    setCities([]);
    setStates([]);
    setSelectedState(null);
    setSelectedCountry(null);
  }, []);

  const goBack = useCallback(() => {
    if (selectionLevel === 'city') {
      setSelectionLevel('state');
      setCities([]);
      setSelectedState(null);
      if (selectedCountry) {
        loadStates(selectedCountry.code);
      }
    } else if (selectionLevel === 'state') {
      setSelectionLevel('country');
      setStates([]);
      setSelectedCountry(null);
      loadCountries();
    }
  }, [selectionLevel, selectedCountry, loadStates, loadCountries]);

  // Load previously selected location details if needed
  useEffect(() => {
    if (value && value.includes('|')) {
      const parts = value.split('|');
      if (parts.length >= 5) {
        // Previously selected location exists
        // We could potentially preload the specific country, state, city here
        // For now, we'll just rely on the formatted display
      }
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) {
        resetSelections();
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
            ) : selectionLevel === 'country' ? (
              // Country selection
              <div className="py-2">
                {countries.map((country) => (
                  <div
                    key={country.id}
                    className="px-2 py-1.5 cursor-pointer hover:bg-primary hover:text-white flex items-center justify-between"
                    onClick={() => handleCountrySelect(country)}
                  >
                    <span>{country.name}</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                ))}
              </div>
            ) : selectionLevel === 'state' ? (
              // State selection
              <>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal hover:bg-primary hover:text-white"
                    onClick={goBack}
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
              // City selection
              <>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal hover:bg-primary hover:text-white"
                    onClick={goBack}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to States
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
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
