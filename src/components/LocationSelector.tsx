
import { useState, useEffect } from 'react';
import { Check, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Location {
  id: string;
  name: string;
  area?: string;
  place_id?: string;
  description?: string;
}

interface LocationSelectorProps {
  value: string | null;
  onChange: (location: string | null) => void;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!searchQuery) {
      setPredictions([]);
      return;
    }

    const fetchPredictions = async () => {
      try {
        setLoading(true);
        
        const { data: apiKey } = await supabase.rpc('get_secret', {
          name: 'OLA_MAPS_API_KEY'
        });

        if (!apiKey) {
          console.error('Maps API key not found');
          toast({
            title: "Error",
            description: "Location services are not fully configured.",
            variant: "destructive",
          });
          return;
        }

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            searchQuery
          )}&components=country:in&key=${apiKey}&types=(cities)`,
          {
            headers: {
              'Accept': 'application/json',
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch predictions');
        }

        const data = await response.json();
        
        if (data.status === 'OK') {
          setPredictions(data.predictions);
        } else {
          console.error('Error fetching predictions:', data.status);
          setPredictions([]);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
        toast({
          title: "Error",
          description: "Could not fetch location suggestions. Please try again.",
          variant: "destructive",
        });
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchPredictions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, toast]);

  const locations: Location[] = predictions.map(prediction => ({
    id: prediction.place_id,
    name: prediction.structured_formatting.main_text,
    area: prediction.structured_formatting.secondary_text,
    place_id: prediction.place_id,
    description: prediction.description
  }));

  const selectedLocation = value 
    ? locations.find(location => 
        location.area 
          ? `${location.name}, ${location.area}` === value
          : location.name === value
      )
    : null;

  const handleLocationSelect = (location: Location) => {
    const newValue = location.area 
      ? `${location.name}, ${location.area}`
      : location.name;
    onChange(newValue);
    setOpen(false);
    setSearchQuery('');
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
            <MapPin className="h-4 w-4" />
            {selectedLocation ? (
              <span className="truncate">
                {selectedLocation.area 
                  ? `${selectedLocation.name}, ${selectedLocation.area}`
                  : selectedLocation.name}
              </span>
            ) : (
              "Select location"
            )}
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
          {loading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Loading locations...
            </div>
          )}
          {!loading && predictions.length === 0 && searchQuery && (
            <CommandEmpty>No location found.</CommandEmpty>
          )}
          <CommandGroup>
            {locations.map((location) => (
              <CommandItem
                key={location.id}
                value={location.id}
                onSelect={() => handleLocationSelect(location)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    (location.area 
                      ? `${location.name}, ${location.area}` === value
                      : location.name === value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{location.name}</span>
                  {location.area && (
                    <span className="text-sm text-muted-foreground">{location.area}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
