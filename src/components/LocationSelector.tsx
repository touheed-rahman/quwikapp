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
      if (stateId === 'in-1') { // Andhra Pradesh, India
        setCities([
          { id: 'vskp', name: 'Visakhapatnam', state_id: 'in-1', latitude: 17.6868, longitude: 83.2185 },
          { id: 'vjwd', name: 'Vijayawada', state_id: 'in-1', latitude: 16.5062, longitude: 80.6480 },
          { id: 'gntr', name: 'Guntur', state_id: 'in-1', latitude: 16.3067, longitude: 80.4365 },
          { id: 'nllr', name: 'Nellore', state_id: 'in-1', latitude: 14.4426, longitude: 79.9865 },
          { id: 'krnl', name: 'Kurnool', state_id: 'in-1', latitude: 15.8281, longitude: 78.0373 },
          { id: 'tpti', name: 'Tirupati', state_id: 'in-1', latitude: 13.6288, longitude: 79.4192 },
          { id: 'kknl', name: 'Kakinada', state_id: 'in-1', latitude: 16.9891, longitude: 82.2475 },
          { id: 'rjhm', name: 'Rajahmundry', state_id: 'in-1', latitude: 17.0005, longitude: 81.8040 },
          { id: 'antp', name: 'Anantapur', state_id: 'in-1', latitude: 14.6819, longitude: 77.6006 },
          { id: 'kndp', name: 'Kadapa', state_id: 'in-1', latitude: 14.4673, longitude: 78.8242 }
        ]);
      } else if (stateId === 'in-2') { // Arunachal Pradesh, India
        setCities([
          { id: 'itng', name: 'Itanagar', state_id: 'in-2', latitude: 27.0844, longitude: 93.6053 },
          { id: 'pshg', name: 'Pasighat', state_id: 'in-2', latitude: 28.0678, longitude: 95.3932 },
          { id: 'nhrg', name: 'Naharlagun', state_id: 'in-2', latitude: 27.1044, longitude: 93.6953 },
          { id: 'aalo', name: 'Aalo', state_id: 'in-2', latitude: 28.1669, longitude: 94.8022 },
          { id: 'tezp', name: 'Tezu', state_id: 'in-2', latitude: 27.9212, longitude: 96.1250 },
          { id: 'bomg', name: 'Bomdila', state_id: 'in-2', latitude: 27.2526, longitude: 92.4148 },
          { id: 'zngt', name: 'Ziro', state_id: 'in-2', latitude: 27.5878, longitude: 93.8301 },
          { id: 'rkgn', name: 'Roing', state_id: 'in-2', latitude: 28.1445, longitude: 95.8416 },
          { id: 'alkn', name: 'Along', state_id: 'in-2', latitude: 28.1693, longitude: 94.7667 },
          { id: 'binh', name: 'Bhalukpong', state_id: 'in-2', latitude: 27.0169, longitude: 92.6503 }
        ]);
      } else if (stateId === 'in-3') { // Assam, India
        setCities([
          { id: 'guwt', name: 'Guwahati', state_id: 'in-3', latitude: 26.1445, longitude: 91.7362 },
          { id: 'slch', name: 'Silchar', state_id: 'in-3', latitude: 24.8333, longitude: 92.7789 },
          { id: 'diby', name: 'Dibrugarh', state_id: 'in-3', latitude: 27.4728, longitude: 94.9120 },
          { id: 'jrht', name: 'Jorhat', state_id: 'in-3', latitude: 26.7509, longitude: 94.2037 },
          { id: 'nagn', name: 'Nagaon', state_id: 'in-3', latitude: 26.3452, longitude: 92.6840 },
          { id: 'tinx', name: 'Tinsukia', state_id: 'in-3', latitude: 27.4922, longitude: 95.3468 },
          { id: 'tezn', name: 'Tezpur', state_id: 'in-3', latitude: 26.6528, longitude: 92.8050 },
          { id: 'barp', name: 'Barpeta', state_id: 'in-3', latitude: 26.3175, longitude: 91.0047 },
          { id: 'gola', name: 'Golaghat', state_id: 'in-3', latitude: 26.5128, longitude: 93.9701 },
          { id: 'kokj', name: 'Kokrajhar', state_id: 'in-3', latitude: 26.4010, longitude: 90.2714 }
        ]);
      } else if (stateId === 'in-4') { // Bihar, India
        setCities([
          { id: 'patn', name: 'Patna', state_id: 'in-4', latitude: 25.5941, longitude: 85.1376 },
          { id: 'gaya', name: 'Gaya', state_id: 'in-4', latitude: 24.7914, longitude: 85.0002 },
          { id: 'muzf', name: 'Muzaffarpur', state_id: 'in-4', latitude: 26.1209, longitude: 85.3647 },
          { id: 'bhag', name: 'Bhagalpur', state_id: 'in-4', latitude: 25.2425, longitude: 87.0079 },
          { id: 'darb', name: 'Darbhanga', state_id: 'in-4', latitude: 26.1542, longitude: 85.8918 },
          { id: 'purx', name: 'Purnia', state_id: 'in-4', latitude: 25.7771, longitude: 87.4753 },
          { id: 'arar', name: 'Arrah', state_id: 'in-4', latitude: 25.5561, longitude: 84.6602 },
          { id: 'begu', name: 'Begusarai', state_id: 'in-4', latitude: 25.4182, longitude: 86.1272 },
          { id: 'kati', name: 'Katihar', state_id: 'in-4', latitude: 25.5574, longitude: 87.5694 },
          { id: 'chhm', name: 'Chhapra', state_id: 'in-4', latitude: 25.7825, longitude: 84.7549 }
        ]);
      } else if (stateId === 'in-5') { // Chhattisgarh, India
        setCities([
          { id: 'raip', name: 'Raipur', state_id: 'in-5', latitude: 21.2514, longitude: 81.6296 },
          { id: 'bilx', name: 'Bilaspur', state_id: 'in-5', latitude: 22.0797, longitude: 82.1409 },
          { id: 'bhix', name: 'Bhilai', state_id: 'in-5', latitude: 21.2090, longitude: 81.4285 },
          { id: 'korb', name: 'Korba', state_id: 'in-5', latitude: 22.3595, longitude: 82.7501 },
          { id: 'raig', name: 'Raigarh', state_id: 'in-5', latitude: 21.8974, longitude: 83.3997 },
          { id: 'jgdp', name: 'Jagdalpur', state_id: 'in-5', latitude: 19.0777, longitude: 82.0347 },
          { id: 'ambi', name: 'Ambikapur', state_id: 'in-5', latitude: 23.1200, longitude: 83.1950 },
          { id: 'durg', name: 'Durg', state_id: 'in-5', latitude: 21.1812, longitude: 81.2849 },
          { id: 'rajna', name: 'Rajnandgaon', state_id: 'in-5', latitude: 21.0972, longitude: 81.0338 },
         { id: 'dhmx', name: 'Dhamtari', state_id: 'in-5', latitude: 20.7070, longitude: 81.5480 },
