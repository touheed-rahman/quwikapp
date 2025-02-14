export interface Location {
  name: string;
  area?: string;
  latitude: number;
  longitude: number;
  distance_km?: number;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

export interface LocationSelectorProps {
  value: string | null;
  onChange: (location: string | null) => void;
}

export interface PlacePrediction {
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Timeout = ReturnType<typeof setTimeout>;

export const useLocationSearch = (searchQuery: string) => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const debounceTimeout = useRef<Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const getPlaceDetails = async (area: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('places', {
        body: { endpoint: 'details', area }
      });

      if (error) throw new Error(error.message);
      if (data.status === 'OK' && data.result) {
        const { name, formatted_address, geometry } = data.result;
        return {
          name,
          area: formatted_address,
          latitude: geometry.location.lat,
          longitude: geometry.location.lng,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  const cacheLocation = async (details: Location) => {
    try {
      const { error } = await supabase.from('location_cache').upsert({
        name: details.name,
        area: details.area ?? '',
        latitude: details.latitude,
        longitude: details.longitude,
        coordinates: `POINT(${details.longitude} ${details.latitude})`,
        place_id: ''
      });
      if (error) console.error('Error caching location:', error);
    } catch (error) {
      console.error('Error in caching location:', error);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setPredictions([]);
      return;
    }

    const fetchPredictions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('places', {
          body: { endpoint: 'autocomplete', input: searchQuery }
        });

        if (error) {
          console.error('Supabase error:', error);
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
          setPredictions([]);
          return;
        }

        if (data?.status === 'OK' && data.predictions) {
          setPredictions(data.predictions);
        } else {
          setPredictions([]);
        }
      } catch (error) {
        console.error('Autocomplete API error:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch location predictions.',
          variant: 'destructive',
        });
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(fetchPredictions, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      if (abortController.current) abortController.current.abort();
    };
  }, [searchQuery, toast]);

  const handleLocationSelect = async (location: Location | PlacePrediction) => {
    const area = 'area' in location ? location.area ?? location.structured_formatting.secondary_text : location.structured_formatting.secondary_text;
    const details = await getPlaceDetails(area);
    if (details) {
      await cacheLocation(details);
      return {
        name: details.name,
        area: details.area,
        latitude: details.latitude,
        longitude: details.longitude,
        structured_formatting: {
          main_text: details.name,
          secondary_text: details.area || '',
        }
      };
    }
    return null;
  };

  const locations: Location[] = predictions.map((pred) => ({
    name: pred.structured_formatting.main_text,
    area: pred.structured_formatting.secondary_text ?? '',
    latitude: 0,
    longitude: 0,
    structured_formatting: pred.structured_formatting,
  }));

  return { locations, loading, handleLocationSelect };
};

