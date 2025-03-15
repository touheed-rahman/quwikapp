
import { useState, useCallback, useEffect, useRef } from 'react';
import { MapPin, Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Location, State, City, Country } from './location/types';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from './ui/scroll-area';
import { countries } from './location/data/countries';
import { getStatesByCountry } from './location/data/states';
import { getCitiesByState } from './location/data/cities';
import { countryCurrencies } from './location/data/currencies';

const LocationSelector = ({ value, onChange }: { value: string | null, onChange: (value: string | null) => void }) => {
  const [open, setOpen] = useState(false);
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getLocationName = useCallback((locationString: string) => {
    if (!locationString) return '';
    const parts = locationString.split('|');
    if (parts.length >= 3) {
      const [city, state, country] = parts;
      return country ? `${city}, ${state}, ${country}` : `${city}, ${state}`;
    }
    return locationString;
  }, []);
  
  const loadCountries = useCallback(async () => {
    setLoading(true);
    try {
      setCountriesList(countries);
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
    if (!countryId) return;
    
    setLoading(true);
    try {
      const statesList = getStatesByCountry(countryId);
      setStates(statesList);
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
      // Scroll to top when loading new cities
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
      
      const citiesList = getCitiesByState(stateId);
      setCities(citiesList);
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

  const reset = () => {
    setSelectedCountry(null);
    setSelectedState(null);
    setCities([]);
    setStates([]);
  };

  useEffect(() => {
    if (open) {
      loadCountries();
    }
  }, [open, loadCountries]);

  // Parse the current location value if it exists
  useEffect(() => {
    if (value && open) {
      const parts = value.split('|');
      if (parts.length >= 3) {
        const [cityName, stateName, countryName] = parts;
        
        // Find the country by name
        const country = countries.find(c => c.name === countryName);
        if (country) {
          setSelectedCountry(country);
          const statesList = getStatesByCountry(country.id);
          setStates(statesList);
          
          // Find the state by name
          const state = statesList.find(s => s.name === stateName);
          if (state) {
            setSelectedState(state);
            loadCities(state.id);
          }
        }
      }
    }
  }, [value, open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 py-2"
        >
          {value ? (
            <span className="flex items-start gap-2 text-left">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{getLocationName(value)}</span>
            </span>
          ) : (
            <span className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>Select location</span>
            </span>
          )}
          <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-[340px] p-0" align="start">
        <Command className="w-full">
          {!selectedCountry ? (
            <>
              <div className="p-3 border-b">
                <h3 className="text-sm font-medium">Select Country</h3>
              </div>
              <CommandList>
                <ScrollArea className="h-80">
                  {loading ? (
                    <div className="flex justify-center items-center py-6">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      {countriesList.length === 0 ? (
                        <CommandEmpty>No countries found.</CommandEmpty>
                      ) : (
                        <div className="py-2">
                          {countriesList.map((country) => (
                            <div
                              key={country.id}
                              className="flex items-center px-4 py-2 hover:bg-accent cursor-pointer"
                              onClick={() => {
                                setSelectedCountry(country);
                                loadStates(country.id);
                              }}
                            >
                              <span>{country.name}</span>
                              {country.code && (
                                <span className="ml-2 text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                  {country.code}
                                </span>
                              )}
                              {countryCurrencies[country.id] && (
                                <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                  {countryCurrencies[country.id].symbol} {countryCurrencies[country.id].code}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </ScrollArea>
              </CommandList>
            </>
          ) : !selectedState ? (
            <>
              <div className="p-3 border-b flex items-center">
                <Button
                  variant="ghost"
                  className="h-auto p-0 mr-2"
                  onClick={reset}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-sm font-medium">
                  {selectedCountry.name}: Select State/Region
                </h3>
              </div>
              <CommandList>
                <ScrollArea className="h-80">
                  {loading ? (
                    <div className="flex justify-center items-center py-6">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      {states.length === 0 ? (
                        <CommandEmpty>No states found.</CommandEmpty>
                      ) : (
                        <div className="py-2">
                          {states.map((state) => (
                            <div
                              key={state.id}
                              className="flex items-center px-4 py-2 hover:bg-accent cursor-pointer"
                              onClick={() => {
                                setSelectedState(state);
                                loadCities(state.id);
                              }}
                            >
                              <span>{state.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </ScrollArea>
              </CommandList>
            </>
          ) : (
            <>
              <div className="p-3 border-b flex items-center">
                <Button
                  variant="ghost"
                  className="h-auto p-0 mr-2"
                  onClick={() => {
                    setSelectedState(null);
                    setCities([]);
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-sm font-medium">
                  {selectedState.name}: Select City
                </h3>
              </div>
              <CommandList>
                <ScrollArea className="h-80" ref={scrollRef}>
                  {loading ? (
                    <div className="flex justify-center items-center py-6">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      {cities.length === 0 ? (
                        <CommandEmpty>No cities found.</CommandEmpty>
                      ) : (
                        <div className="py-2">
                          {cities.map((city) => (
                            <div
                              key={city.id}
                              className="flex items-center px-4 py-2 hover:bg-accent cursor-pointer"
                              onClick={() => {
                                const locationValue = `${city.name}|${selectedState.name}|${selectedCountry.name}|${city.latitude}|${city.longitude}|${city.id}`;
                                onChange(locationValue);
                                setOpen(false);
                                reset();
                              }}
                            >
                              <span>{city.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </ScrollArea>
              </CommandList>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
