
import { useState, useCallback, useEffect } from 'react';
import { MapPin, Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Location, State, City, Country } from './location/types';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from './ui/scroll-area';

const LocationSelector = ({ value, onChange }: { value: string | null, onChange: (value: string | null) => void }) => {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [loading, setLoading] = useState(false);
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
      // For now, we'll use a fixed list of countries
      const countriesList: Country[] = [
        { id: '1', name: 'United States', code: 'US' },
        { id: '2', name: 'India', code: 'IN' },
        { id: '3', name: 'Canada', code: 'CA' },
        { id: '4', name: 'United Kingdom', code: 'GB' },
        { id: '5', name: 'Australia', code: 'AU' },
        { id: '6', name: 'Germany', code: 'DE' },
        { id: '7', name: 'France', code: 'FR' },
        { id: '8', name: 'Japan', code: 'JP' },
        { id: '9', name: 'China', code: 'CN' },
        { id: '10', name: 'Brazil', code: 'BR' },
        { id: '11', name: 'Mexico', code: 'MX' },
        { id: '12', name: 'Italy', code: 'IT' },
        { id: '13', name: 'Spain', code: 'ES' },
        { id: '14', name: 'Netherlands', code: 'NL' },
        { id: '15', name: 'Sweden', code: 'SE' },
        { id: '16', name: 'Norway', code: 'NO' },
        { id: '17', name: 'Denmark', code: 'DK' },
        { id: '18', name: 'Finland', code: 'FI' },
        { id: '19', name: 'Belgium', code: 'BE' },
        { id: '20', name: 'Switzerland', code: 'CH' },
        { id: '21', name: 'Austria', code: 'AT' },
        { id: '22', name: 'Portugal', code: 'PT' },
        { id: '23', name: 'Greece', code: 'GR' },
        { id: '24', name: 'Ireland', code: 'IE' },
        { id: '25', name: 'Poland', code: 'PL' },
        { id: '26', name: 'Russia', code: 'RU' },
        { id: '27', name: 'Turkey', code: 'TR' },
        { id: '28', name: 'South Africa', code: 'ZA' },
        { id: '29', name: 'Nigeria', code: 'NG' },
        { id: '30', name: 'Egypt', code: 'EG' },
        { id: '31', name: 'Saudi Arabia', code: 'SA' },
        { id: '32', name: 'United Arab Emirates', code: 'AE' },
        { id: '33', name: 'Thailand', code: 'TH' },
        { id: '34', name: 'Vietnam', code: 'VN' },
        { id: '35', name: 'Singapore', code: 'SG' },
        { id: '36', name: 'Malaysia', code: 'MY' },
        { id: '37', name: 'Indonesia', code: 'ID' },
        { id: '38', name: 'Philippines', code: 'PH' },
        { id: '39', name: 'New Zealand', code: 'NZ' },
        { id: '40', name: 'Argentina', code: 'AR' },
        { id: '41', name: 'Chile', code: 'CL' },
        { id: '42', name: 'Colombia', code: 'CO' },
        { id: '43', name: 'Peru', code: 'PE' },
        { id: '44', name: 'Venezuela', code: 'VE' },
        { id: '45', name: 'Hungary', code: 'HU' },
        { id: '46', name: 'Czech Republic', code: 'CZ' },
        { id: '47', name: 'Qatar', code: 'QA' },
        { id: '48', name: 'Kuwait', code: 'KW' },
        { id: '49', name: 'Bahrain', code: 'BH' },
        { id: '50', name: 'Oman', code: 'OM' },
        { id: '51', name: 'Lebanon', code: 'LB' },
        { id: '52', name: 'Jordan', code: 'JO' },
        { id: '53', name: 'Iran', code: 'IR' },
        { id: '54', name: 'Iraq', code: 'IQ' },
        { id: '55', name: 'South Korea', code: 'KR' },
        { id: '56', name: 'Pakistan', code: 'PK' },
        { id: '57', name: 'Bangladesh', code: 'BD' },
        { id: '58', name: 'Sri Lanka', code: 'LK' },
        { id: '59', name: 'Kenya', code: 'KE' },
        { id: '60', name: 'Morocco', code: 'MA' },
      ];
      
      setCountries(countriesList);
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
      // For demo purposes, we'll load states from Supabase for US and India
      // and use static data for other countries
      let statesList: State[] = [];
      
      if (countryId === '1') { // US
        const { data: states, error } = await supabase
          .from('states')
          .select('*')
          .order('name');

        if (error) throw error;
        statesList = states as State[] || [];
      } else if (countryId === '2') { // India
        statesList = [
          { id: 'in-1', name: 'Andhra Pradesh' },
          { id: 'in-2', name: 'Arunachal Pradesh' },
          { id: 'in-3', name: 'Assam' },
          { id: 'in-4', name: 'Bihar' },
          { id: 'in-5', name: 'Chhattisgarh' },
          { id: 'in-6', name: 'Goa' },
          { id: 'in-7', name: 'Gujarat' },
          { id: 'in-8', name: 'Haryana' },
          { id: 'in-9', name: 'Himachal Pradesh' },
          { id: 'in-10', name: 'Jharkhand' },
          { id: 'in-11', name: 'Karnataka' },
          { id: 'in-12', name: 'Kerala' },
          { id: 'in-13', name: 'Madhya Pradesh' },
          { id: 'in-14', name: 'Maharashtra' },
          { id: 'in-15', name: 'Manipur' },
          { id: 'in-16', name: 'Meghalaya' },
          { id: 'in-17', name: 'Mizoram' },
          { id: 'in-18', name: 'Nagaland' },
          { id: 'in-19', name: 'Odisha' },
          { id: 'in-20', name: 'Punjab' },
          { id: 'in-21', name: 'Rajasthan' },
          { id: 'in-22', name: 'Sikkim' },
          { id: 'in-23', name: 'Tamil Nadu' },
          { id: 'in-24', name: 'Telangana' },
          { id: 'in-25', name: 'Tripura' },
          { id: 'in-26', name: 'Uttar Pradesh' },
          { id: 'in-27', name: 'Uttarakhand' },
          { id: 'in-28', name: 'West Bengal' },
          { id: 'in-29', name: 'Delhi' },
        ];
      } else if (countryId === '3') { // Canada
        statesList = [
          { id: 'ca-1', name: 'Alberta' },
          { id: 'ca-2', name: 'British Columbia' },
          { id: 'ca-3', name: 'Manitoba' },
          { id: 'ca-4', name: 'New Brunswick' },
          { id: 'ca-5', name: 'Newfoundland and Labrador' },
          { id: 'ca-6', name: 'Northwest Territories' },
          { id: 'ca-7', name: 'Nova Scotia' },
          { id: 'ca-8', name: 'Nunavut' },
          { id: 'ca-9', name: 'Ontario' },
          { id: 'ca-10', name: 'Prince Edward Island' },
          { id: 'ca-11', name: 'Quebec' },
          { id: 'ca-12', name: 'Saskatchewan' },
          { id: 'ca-13', name: 'Yukon' },
        ];
      } else if (countryId === '4') { // UK
        statesList = [
          { id: 'uk-1', name: 'England' },
          { id: 'uk-2', name: 'Scotland' },
          { id: 'uk-3', name: 'Wales' },
          { id: 'uk-4', name: 'Northern Ireland' },
        ];
      } else {
        // Default states for other countries
        statesList = [
          { id: `${countryId}-1`, name: 'State 1' },
          { id: `${countryId}-2`, name: 'State 2' },
          { id: `${countryId}-3`, name: 'State 3' },
        ];
      }

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
      // Check if the state ID is one of our predefined ones
      if (stateId.startsWith('in-')) {
        // For Indian states, use a list of major cities
        const indianCities: Record<string, City[]> = {
          'in-11': [ // Karnataka
            { id: 'blr', name: 'Bengaluru', state_id: 'in-11', latitude: 12.9716, longitude: 77.5946 },
            { id: 'mys', name: 'Mysuru', state_id: 'in-11', latitude: 12.2958, longitude: 76.6394 },
            { id: 'hub', name: 'Hubballi', state_id: 'in-11', latitude: 15.3647, longitude: 75.1240 },
            { id: 'mng', name: 'Mangaluru', state_id: 'in-11', latitude: 12.9141, longitude: 74.8560 },
          ],
          'in-14': [ // Maharashtra
            { id: 'mum', name: 'Mumbai', state_id: 'in-14', latitude: 19.0760, longitude: 72.8777 },
            { id: 'pun', name: 'Pune', state_id: 'in-14', latitude: 18.5204, longitude: 73.8567 },
            { id: 'nag', name: 'Nagpur', state_id: 'in-14', latitude: 21.1458, longitude: 79.0882 },
            { id: 'aur', name: 'Aurangabad', state_id: 'in-14', latitude: 19.8762, longitude: 75.3433 },
          ],
          'in-23': [ // Tamil Nadu
            { id: 'chn', name: 'Chennai', state_id: 'in-23', latitude: 13.0827, longitude: 80.2707 },
            { id: 'cbe', name: 'Coimbatore', state_id: 'in-23', latitude: 11.0168, longitude: 76.9558 },
            { id: 'mdu', name: 'Madurai', state_id: 'in-23', latitude: 9.9252, longitude: 78.1198 },
            { id: 'tri', name: 'Tiruchirappalli', state_id: 'in-23', latitude: 10.7905, longitude: 78.7047 },
          ],
          // Add more states and cities as needed
        };
        
        setCities(indianCities[stateId] || []);
      } else {
        // For other states, try to get from Supabase
        const { data: cities, error } = await supabase
          .from('cities')
          .select('*')
          .eq('state_id', stateId)
          .order('name');

        if (error) throw error;

        // Filter out Bangalore if Bengaluru exists
        const filteredCities = cities?.filter(city => 
          city.name !== 'Bangalore' || !cities.some(c => c.name === 'Bengaluru')
        ) || [];

        setCities(filteredCities);
      }
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

  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    loadStates(country.id);
    setSelectedState(null);
    setCities([]);
  }, [loadStates]);

  const handleStateSelect = useCallback(async (state: State) => {
    setSelectedState(state);
    await loadCities(state.id);
  }, [loadCities]);

  const handleCitySelect = useCallback((city: City) => {
    if (!selectedState || !selectedCountry) return;
    
    const locationString = `${city.name}|${selectedState.name}|${selectedCountry.name}|${city.latitude}|${city.longitude}|${city.id}`;
    onChange(locationString);
    setOpen(false);
    setCities([]);
    setSelectedState(null);
    setSelectedCountry(null);
  }, [selectedState, selectedCountry, onChange]);

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
            ) : selectedState ? (
              <>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal hover:bg-primary hover:text-white"
                    onClick={() => {
                      setSelectedState(null);
                      setCities([]);
                      if (selectedCountry) loadStates(selectedCountry.id);
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to States
                  </Button>
                </div>
                <ScrollArea className="h-[200px]">
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
                    {cities.length === 0 && !loading && (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        No cities found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : selectedCountry ? (
              <>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start font-normal hover:bg-primary hover:text-white"
                    onClick={() => {
                      setSelectedCountry(null);
                      setStates([]);
                      loadCountries();
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Countries
                  </Button>
                </div>
                <ScrollArea className="h-[200px]">
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
                </ScrollArea>
              </>
            ) : (
              <ScrollArea className="h-[200px]">
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
              </ScrollArea>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
