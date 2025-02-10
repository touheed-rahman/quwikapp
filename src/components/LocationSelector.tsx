
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

interface Location {
  id: string;
  name: string;
  area?: string;
}

const cities = [
  {
    id: "bangalore",
    name: "Bangalore",
    areas: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "JP Nagar"]
  },
  {
    id: "mumbai",
    name: "Mumbai",
    areas: ["Andheri", "Bandra", "Colaba", "Juhu", "Powai"]
  },
  {
    id: "delhi",
    name: "Delhi",
    areas: ["Connaught Place", "Hauz Khas", "Dwarka", "Saket", "Rohini"]
  }
];

const LocationSelector = () => {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      const { data: { secret }, error } = await supabase.rpc('get_secret', {
        name: 'OLA_MAPS_API_KEY'
      });
      
      if (error) {
        console.error('Error fetching API key:', error);
        return;
      }
      
      setApiKey(secret);
    };

    fetchApiKey();
  }, []);

  const locations: Location[] = cities.flatMap(city => 
    [
      { id: city.id, name: city.name },
      ...city.areas.map(area => ({
        id: `${city.id}-${area.toLowerCase().replace(/\s+/g, '-')}`,
        name: area,
        area: city.name
      }))
    ]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-48 justify-between text-muted-foreground hover:text-foreground"
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
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandEmpty>No location found.</CommandEmpty>
          <CommandGroup>
            {locations.map((location) => (
              <CommandItem
                key={location.id}
                value={location.id}
                onSelect={() => {
                  setSelectedLocation(location);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedLocation?.id === location.id 
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                <span className="truncate">
                  {location.area 
                    ? `${location.name}, ${location.area}`
                    : location.name}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSelector;
