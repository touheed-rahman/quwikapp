
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
      // Comprehensive list of countries with their codes
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
      let statesList: State[] = [];
      
      if (countryId === '1') { // US
        statesList = [
          { id: 'us-1', name: 'Alabama' },
          { id: 'us-2', name: 'Alaska' },
          { id: 'us-3', name: 'Arizona' },
          { id: 'us-4', name: 'Arkansas' },
          { id: 'us-5', name: 'California' },
          { id: 'us-6', name: 'Colorado' },
          { id: 'us-7', name: 'Connecticut' },
          { id: 'us-8', name: 'Delaware' },
          { id: 'us-9', name: 'Florida' },
          { id: 'us-10', name: 'Georgia' },
          { id: 'us-11', name: 'Hawaii' },
          { id: 'us-12', name: 'Idaho' },
          { id: 'us-13', name: 'Illinois' },
          { id: 'us-14', name: 'Indiana' },
          { id: 'us-15', name: 'Iowa' },
          { id: 'us-16', name: 'Kansas' },
          { id: 'us-17', name: 'Kentucky' },
          { id: 'us-18', name: 'Louisiana' },
          { id: 'us-19', name: 'Maine' },
          { id: 'us-20', name: 'Maryland' },
          { id: 'us-21', name: 'Massachusetts' },
          { id: 'us-22', name: 'Michigan' },
          { id: 'us-23', name: 'Minnesota' },
          { id: 'us-24', name: 'Mississippi' },
          { id: 'us-25', name: 'Missouri' },
          { id: 'us-26', name: 'Montana' },
          { id: 'us-27', name: 'Nebraska' },
          { id: 'us-28', name: 'Nevada' },
          { id: 'us-29', name: 'New Hampshire' },
          { id: 'us-30', name: 'New Jersey' },
          { id: 'us-31', name: 'New Mexico' },
          { id: 'us-32', name: 'New York' },
          { id: 'us-33', name: 'North Carolina' },
          { id: 'us-34', name: 'North Dakota' },
          { id: 'us-35', name: 'Ohio' },
          { id: 'us-36', name: 'Oklahoma' },
          { id: 'us-37', name: 'Oregon' },
          { id: 'us-38', name: 'Pennsylvania' },
          { id: 'us-39', name: 'Rhode Island' },
          { id: 'us-40', name: 'South Carolina' },
          { id: 'us-41', name: 'South Dakota' },
          { id: 'us-42', name: 'Tennessee' },
          { id: 'us-43', name: 'Texas' },
          { id: 'us-44', name: 'Utah' },
          { id: 'us-45', name: 'Vermont' },
          { id: 'us-46', name: 'Virginia' },
          { id: 'us-47', name: 'Washington' },
          { id: 'us-48', name: 'West Virginia' },
          { id: 'us-49', name: 'Wisconsin' },
          { id: 'us-50', name: 'Wyoming' },
          { id: 'us-51', name: 'District of Columbia' },
          { id: 'us-52', name: 'Puerto Rico' },
          { id: 'us-53', name: 'Guam' },
          { id: 'us-54', name: 'American Samoa' },
          { id: 'us-55', name: 'U.S. Virgin Islands' },
          { id: 'us-56', name: 'Northern Mariana Islands' }
        ];
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
          { id: 'in-30', name: 'Jammu and Kashmir' },
          { id: 'in-31', name: 'Ladakh' },
          { id: 'in-32', name: 'Puducherry' },
          { id: 'in-33', name: 'Andaman and Nicobar Islands' },
          { id: 'in-34', name: 'Chandigarh' },
          { id: 'in-35', name: 'Dadra and Nagar Haveli and Daman and Diu' },
          { id: 'in-36', name: 'Lakshadweep' }
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
          { id: 'ca-13', name: 'Yukon' }
        ];
      } else if (countryId === '4') { // UK
        statesList = [
          { id: 'uk-1', name: 'England' },
          { id: 'uk-2', name: 'Scotland' },
          { id: 'uk-3', name: 'Wales' },
          { id: 'uk-4', name: 'Northern Ireland' }
        ];
      } else if (countryId === '5') { // Australia
        statesList = [
          { id: 'au-1', name: 'New South Wales' },
          { id: 'au-2', name: 'Victoria' },
          { id: 'au-3', name: 'Queensland' },
          { id: 'au-4', name: 'Western Australia' },
          { id: 'au-5', name: 'South Australia' },
          { id: 'au-6', name: 'Tasmania' },
          { id: 'au-7', name: 'Australian Capital Territory' },
          { id: 'au-8', name: 'Northern Territory' }
        ];
      } else if (countryId === '6') { // Germany
        statesList = [
          { id: 'de-1', name: 'Baden-Württemberg' },
          { id: 'de-2', name: 'Bavaria' },
          { id: 'de-3', name: 'Berlin' },
          { id: 'de-4', name: 'Brandenburg' },
          { id: 'de-5', name: 'Bremen' },
          { id: 'de-6', name: 'Hamburg' },
          { id: 'de-7', name: 'Hesse' },
          { id: 'de-8', name: 'Lower Saxony' },
          { id: 'de-9', name: 'Mecklenburg-Vorpommern' },
          { id: 'de-10', name: 'North Rhine-Westphalia' },
          { id: 'de-11', name: 'Rhineland-Palatinate' },
          { id: 'de-12', name: 'Saarland' },
          { id: 'de-13', name: 'Saxony' },
          { id: 'de-14', name: 'Saxony-Anhalt' },
          { id: 'de-15', name: 'Schleswig-Holstein' },
          { id: 'de-16', name: 'Thuringia' }
        ];
      } else if (countryId === '7') { // France
        statesList = [
          { id: 'fr-1', name: 'Auvergne-Rhône-Alpes' },
          { id: 'fr-2', name: 'Bourgogne-Franche-Comté' },
          { id: 'fr-3', name: 'Brittany' },
          { id: 'fr-4', name: 'Centre-Val de Loire' },
          { id: 'fr-5', name: 'Corsica' },
          { id: 'fr-6', name: 'Grand Est' },
          { id: 'fr-7', name: 'Hauts-de-France' },
          { id: 'fr-8', name: 'Île-de-France' },
          { id: 'fr-9', name: 'Normandy' },
          { id: 'fr-10', name: 'Nouvelle-Aquitaine' },
          { id: 'fr-11', name: 'Occitanie' },
          { id: 'fr-12', name: 'Pays de la Loire' },
          { id: 'fr-13', name: 'Provence-Alpes-Côte d\'Azur' }
        ];
      } else if (countryId === '8') { // Japan
        statesList = [
          { id: 'jp-1', name: 'Hokkaido' },
          { id: 'jp-2', name: 'Aomori' },
          { id: 'jp-3', name: 'Iwate' },
          { id: 'jp-4', name: 'Miyagi' },
          { id: 'jp-5', name: 'Akita' },
          { id: 'jp-6', name: 'Yamagata' },
          { id: 'jp-7', name: 'Fukushima' },
          { id: 'jp-8', name: 'Ibaraki' },
          { id: 'jp-9', name: 'Tochigi' },
          { id: 'jp-10', name: 'Gunma' },
          { id: 'jp-11', name: 'Saitama' },
          { id: 'jp-12', name: 'Chiba' },
          { id: 'jp-13', name: 'Tokyo' },
          { id: 'jp-14', name: 'Kanagawa' },
          { id: 'jp-15', name: 'Niigata' },
          { id: 'jp-16', name: 'Toyama' },
          { id: 'jp-17', name: 'Ishikawa' },
          { id: 'jp-18', name: 'Fukui' },
          { id: 'jp-19', name: 'Yamanashi' },
          { id: 'jp-20', name: 'Nagano' },
          { id: 'jp-21', name: 'Gifu' },
          { id: 'jp-22', name: 'Shizuoka' },
          { id: 'jp-23', name: 'Aichi' },
          { id: 'jp-24', name: 'Mie' },
          { id: 'jp-25', name: 'Shiga' },
          { id: 'jp-26', name: 'Kyoto' },
          { id: 'jp-27', name: 'Osaka' },
          { id: 'jp-28', name: 'Hyogo' },
          { id: 'jp-29', name: 'Nara' },
          { id: 'jp-30', name: 'Wakayama' },
          { id: 'jp-31', name: 'Tottori' },
          { id: 'jp-32', name: 'Shimane' },
          { id: 'jp-33', name: 'Okayama' },
          { id: 'jp-34', name: 'Hiroshima' },
          { id: 'jp-35', name: 'Yamaguchi' },
          { id: 'jp-36', name: 'Tokushima' },
          { id: 'jp-37', name: 'Kagawa' },
          { id: 'jp-38', name: 'Ehime' },
          { id: 'jp-39', name: 'Kochi' },
          { id: 'jp-40', name: 'Fukuoka' },
          { id: 'jp-41', name: 'Saga' },
          { id: 'jp-42', name: 'Nagasaki' },
          { id: 'jp-43', name: 'Kumamoto' },
          { id: 'jp-44', name: 'Oita' },
          { id: 'jp-45', name: 'Miyazaki' },
          { id: 'jp-46', name: 'Kagoshima' },
          { id: 'jp-47', name: 'Okinawa' }
        ];
      } else {
        // For other countries, return their major administrative divisions
        // This is a simplified approach - for a real app, you'd want a complete database
        statesList = [
          { id: `${countryId}-1`, name: 'Major Region 1' },
          { id: `${countryId}-2`, name: 'Major Region 2' },
          { id: `${countryId}-3`, name: 'Major Region 3' },
          { id: `${countryId}-4`, name: 'Major Region 4' },
          { id: `${countryId}-5`, name: 'Major Region 5' }
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
      // We'll provide detailed cities for some important states
      if (stateId === 'in-11') { // Karnataka, India
        setCities([
          { id: 'blr', name: 'Bengaluru', state_id: 'in-11', latitude: 12.9716, longitude: 77.5946 },
          { id: 'mys', name: 'Mysuru', state_id: 'in-11', latitude: 12.2958, longitude: 76.6394 },
          { id: 'hub', name: 'Hubballi', state_id: 'in-11', latitude: 15.3647, longitude: 75.1240 },
          { id: 'mng', name: 'Mangaluru', state_id: 'in-11', latitude: 12.9141, longitude: 74.8560 },
          { id: 'bel', name: 'Belagavi', state_id: 'in-11', latitude: 15.8497, longitude: 74.4977 },
          { id: 'dvg', name: 'Davangere', state_id: 'in-11', latitude: 14.4644, longitude: 75.9218 },
          { id: 'gul', name: 'Kalaburagi', state_id: 'in-11', latitude: 17.3297, longitude: 76.8343 },
          { id: 'tmk', name: 'Tumakuru', state_id: 'in-11', latitude: 13.3379, longitude: 77.1173 },
          { id: 'shi', name: 'Shivamogga', state_id: 'in-11', latitude: 13.9299, longitude: 75.5681 },
          { id: 'bidar', name: 'Bidar', state_id: 'in-11', latitude: 17.9104, longitude: 77.5199 }
        ]);
      } else if (stateId === 'in-14') { // Maharashtra, India
        setCities([
          { id: 'mum', name: 'Mumbai', state_id: 'in-14', latitude: 19.0760, longitude: 72.8777 },
          { id: 'pun', name: 'Pune', state_id: 'in-14', latitude: 18.5204, longitude: 73.8567 },
          { id: 'nag', name: 'Nagpur', state_id: 'in-14', latitude: 21.1458, longitude: 79.0882 },
          { id: 'aur', name: 'Aurangabad', state_id: 'in-14', latitude: 19.8762, longitude: 75.3433 },
          { id: 'nas', name: 'Nashik', state_id: 'in-14', latitude: 19.9975, longitude: 73.7898 },
          { id: 'sol', name: 'Solapur', state_id: 'in-14', latitude: 17.6599, longitude: 75.9064 },
          { id: 'kol', name: 'Kolhapur', state_id: 'in-14', latitude: 16.7050, longitude: 74.2433 },
          { id: 'ama', name: 'Amravati', state_id: 'in-14', latitude: 20.9374, longitude: 77.7796 },
          { id: 'nanded', name: 'Nanded', state_id: 'in-14', latitude: 19.1383, longitude: 77.3210 },
          { id: 'akola', name: 'Akola', state_id: 'in-14', latitude: 20.7002, longitude: 77.0082 }
        ]);
      } else if (stateId === 'in-23') { // Tamil Nadu, India
        setCities([
          { id: 'chn', name: 'Chennai', state_id: 'in-23', latitude: 13.0827, longitude: 80.2707 },
          { id: 'cbe', name: 'Coimbatore', state_id: 'in-23', latitude: 11.0168, longitude: 76.9558 },
          { id: 'mdu', name: 'Madurai', state_id: 'in-23', latitude: 9.9252, longitude: 78.1198 },
          { id: 'tri', name: 'Tiruchirappalli', state_id: 'in-23', latitude: 10.7905, longitude: 78.7047 },
          { id: 'slm', name: 'Salem', state_id: 'in-23', latitude: 11.6643, longitude: 78.1460 },
          { id: 'erode', name: 'Erode', state_id: 'in-23', latitude: 11.3410, longitude: 77.7172 },
          { id: 'vellore', name: 'Vellore', state_id: 'in-23', latitude: 12.9165, longitude: 79.1325 },
          { id: 'thoothukudi', name: 'Thoothukudi', state_id: 'in-23', latitude: 8.7642, longitude: 78.1348 },
          { id: 'tirunelveli', name: 'Tirunelveli', state_id: 'in-23', latitude: 8.7139, longitude: 77.7567 },
          { id: 'tiruppur', name: 'Tiruppur', state_id: 'in-23', latitude: 11.1085, longitude: 77.3411 }
        ]);
      } else if (stateId === 'in-24') { // Telangana, India
        setCities([
          { id: 'hyd', name: 'Hyderabad', state_id: 'in-24', latitude: 17.3850, longitude: 78.4867 },
          { id: 'wgl', name: 'Warangal', state_id: 'in-24', latitude: 18.0000, longitude: 79.5833 },
          { id: 'niz', name: 'Nizamabad', state_id: 'in-24', latitude: 18.6725, longitude: 78.0940 },
          { id: 'krmn', name: 'Karimnagar', state_id: 'in-24', latitude: 18.4392, longitude: 79.1286 },
          { id: 'khm', name: 'Khammam', state_id: 'in-24', latitude: 17.2473, longitude: 80.1514 },
          { id: 'secbad', name: 'Secunderabad', state_id: 'in-24', latitude: 17.4399, longitude: 78.4983 },
          { id: 'adil', name: 'Adilabad', state_id: 'in-24', latitude: 19.6640, longitude: 78.5320 },
          { id: 'nalgonda', name: 'Nalgonda', state_id: 'in-24', latitude: 17.0574, longitude: 79.2687 },
          { id: 'siddipet', name: 'Siddipet', state_id: 'in-24', latitude: 18.1018, longitude: 78.8525 },
          { id: 'mahabub', name: 'Mahbubnagar', state_id: 'in-24', latitude: 16.7375, longitude: 77.9853 }
        ]);
      } else if (stateId === 'us-5') { // California, US
        setCities([
          { id: 'la', name: 'Los Angeles', state_id: 'us-5', latitude: 34.0522, longitude: -118.2437 },
          { id: 'sf', name: 'San Francisco', state_id: 'us-5', latitude: 37.7749, longitude: -122.4194 },
          { id: 'sd', name: 'San Diego', state_id: 'us-5', latitude: 32.7157, longitude: -117.1611 },
          { id: 'sj', name: 'San Jose', state_id: 'us-5', latitude: 37.3382, longitude: -121.8863 },
          { id: 'fres', name: 'Fresno', state_id: 'us-5', latitude: 36.7378, longitude: -119.7871 },
          { id: 'sac', name: 'Sacramento', state_id: 'us-5', latitude: 38.5816, longitude: -121.4944 },
          { id: 'lb', name: 'Long Beach', state_id: 'us-5', latitude: 33.7701, longitude: -118.1937 },
          { id: 'oak', name: 'Oakland', state_id: 'us-5', latitude: 37.8044, longitude: -122.2712 },
          { id: 'bak', name: 'Bakersfield', state_id: 'us-5', latitude: 35.3733, longitude: -119.0187 },
          { id: 'ana', name: 'Anaheim', state_id: 'us-5', latitude: 33.8366, longitude: -117.9143 }
        ]);
      } else if (stateId === 'us-32') { // New York, US
        setCities([
          { id: 'nyc', name: 'New York City', state_id: 'us-32', latitude: 40.7128, longitude: -74.0060 },
          { id: 'buf', name: 'Buffalo', state_id: 'us-32', latitude: 42.8864, longitude: -78.8784 },
          { id: 'roc', name: 'Rochester', state_id: 'us-32', latitude: 43.1566, longitude: -77.6088 },
          { id: 'yonk', name: 'Yonkers', state_id: 'us-32', latitude: 40.9312, longitude: -73.8987 },
          { id: 'syr', name: 'Syracuse', state_id: 'us-32', latitude: 43.0481, longitude: -76.1474 },
          { id: 'alb', name: 'Albany', state_id: 'us-32', latitude: 42.6526, longitude: -73.7562 },
          { id: 'nfalls', name: 'Niagara Falls', state_id: 'us-32', latitude: 43.0962, longitude: -79.0377 },
          { id: 'utica', name: 'Utica', state_id: 'us-32', latitude: 43.1009, longitude: -75.2327 },
          { id: 'bing', name: 'Binghamton', state_id: 'us-32', latitude: 42.0987, longitude: -75.9180 },
          { id: 'white', name: 'White Plains', state_id: 'us-32', latitude: 41.0340, longitude: -73.7629 }
        ]);
      } else if (stateId === 'us-43') { // Texas, US
        setCities([
          { id: 'hou', name: 'Houston', state_id: 'us-43', latitude: 29.7604, longitude: -95.3698 },
          { id: 'san', name: 'San Antonio', state_id: 'us-43', latitude: 29.4241, longitude: -98.4936 },
          { id: 'dal', name: 'Dallas', state_id: 'us-43', latitude: 32.7767, longitude: -96.7970 },
          { id: 'aus', name: 'Austin', state_id: 'us-43', latitude: 30.2672, longitude: -97.7431 },
          { id: 'ftw', name: 'Fort Worth', state_id: 'us-43', latitude: 32.7555, longitude: -97.3308 },
          { id: 'elp', name: 'El Paso', state_id: 'us-43', latitude: 31.7619, longitude: -106.4850 },
          { id: 'arlng', name: 'Arlington', state_id: 'us-43', latitude: 32.7357, longitude: -97.1081 },
          { id: 'corp', name: 'Corpus Christi', state_id: 'us-43', latitude: 27.8006, longitude: -97.3964 },
          { id: 'plano', name: 'Plano', state_id: 'us-43', latitude: 33.0198, longitude: -96.6989 },
          { id: 'lub', name: 'Lubbock', state_id: 'us-43', latitude: 33.5779, longitude: -101.8552 }
        ]);
      } else if (stateId === 'uk-1') { // England, UK
        setCities([
          { id: 'lon', name: 'London', state_id: 'uk-1', latitude: 51.5074, longitude: -0.1278 },
          { id: 'birm', name: 'Birmingham', state_id: 'uk-1', latitude: 52.4862, longitude: -1.8904 },
          { id: 'man', name: 'Manchester', state_id: 'uk-1', latitude: 53.4808, longitude: -2.2426 },
          { id: 'liv', name: 'Liverpool', state_id: 'uk-1', latitude: 53.4084, longitude: -2.9916 },
          { id: 'bris', name: 'Bristol', state_id: 'uk-1', latitude: 51.4545, longitude: -2.5879 },
          { id: 'shef', name: 'Sheffield', state_id: 'uk-1', latitude: 53.3811, longitude: -1.4701 },
          { id: 'leeds', name: 'Leeds', state_id: 'uk-1', latitude: 53.8008, longitude: -1.5491 },
          { id: 'newc', name: 'Newcastle', state_id: 'uk-1', latitude: 54.9783, longitude: -1.6178 },
          { id: 'nott', name: 'Nottingham', state_id: 'uk-1', latitude: 52.9548, longitude: -1.1581 },
          { id: 'soton', name: 'Southampton', state_id: 'uk-1', latitude: 50.9097, longitude: -1.4044 }
        ]);
      } else if (stateId === 'jp-13') { // Tokyo, Japan
        setCities([
          { id: 'shinjuku', name: 'Shinjuku', state_id: 'jp-13', latitude: 35.6938, longitude: 139.7034 },
          { id: 'shibuya', name: 'Shibuya', state_id: 'jp-13', latitude: 35.6580, longitude: 139.7016 },
          { id: 'minato', name: 'Minato', state_id: 'jp-13', latitude: 35.6581, longitude: 139.7511 },
          { id: 'chiyoda', name: 'Chiyoda', state_id: 'jp-13', latitude: 35.6938, longitude: 139.7534 },
          { id: 'toshima', name: 'Toshima', state_id: 'jp-13', latitude: 35.7333, longitude: 139.7167 },
          { id: 'bunkyo', name: 'Bunkyo', state_id: 'jp-13', latitude: 35.7167, longitude: 139.7500 },
          { id: 'ota', name: 'Ota', state_id: 'jp-13', latitude: 35.5667, longitude: 139.7167 },
          { id: 'setagaya', name: 'Setagaya', state_id: 'jp-13', latitude: 35.6464, longitude: 139.6533 },
          { id: 'edogawa', name: 'Edogawa', state_id: 'jp-13', latitude: 35.7000, longitude: 139.8800 },
          { id: 'nerima', name: 'Nerima', state_id: 'jp-13', latitude: 35.7333, longitude: 139.6500 }
        ]);
      } else {
        // For other states or countries, provide generic city data
        const cities: City[] = [];
        for (let i = 1; i <= 5; i++) {
          cities.push({
            id: `${stateId}-city-${i}`,
            name: `Major City ${i}`,
            state_id: stateId,
            latitude: Math.random() * 180 - 90,
            longitude: Math.random() * 360 - 180
          });
        }
        setCities(cities);
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
