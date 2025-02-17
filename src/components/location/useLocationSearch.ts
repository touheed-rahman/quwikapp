
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlacePrediction, Location, PlaceDetails } from './types';

export const useLocationSearch = (searchQuery: string) => {
  const [predictions, setPredictions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const abortController = useRef<AbortController>();

  const getPlaceDetails = async (id: string): Promise<PlaceDetails | null> => {
    try {
      const { data: city, error } = await supabase
        .from('indian_cities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (city) {
        return {
          id: city.id,
          name: city.name,
          area: city.area,
          latitude: city.latitude,
          longitude: city.longitude
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setPredictions([]);
      return;
    }

    const fetchPredictions = async () => {
      try {
        if (abortController.current) {
          abortController.current.abort();
        }
        abortController.current = new AbortController();

        setLoading(true);
        
        const { data: cities, error } = await supabase
          .from('indian_cities')
          .select('*')
          .or(`name.ilike.%${searchQuery}%,area.ilike.%${searchQuery}%,state.ilike.%${searchQuery}%`)
          .limit(10);

        if (error) throw error;

        if (cities) {
          const formattedLocations: Location[] = cities.map(city => ({
            id: city.id,
            name: city.name,
            area: city.area,
            state: city.state,
            latitude: city.latitude,
            longitude: city.longitude
          }));
          setPredictions(formattedLocations);
        } else {
          setPredictions([]);
        }
      } catch (error: any) {
        console.error('Error fetching predictions:', error);
        if (error.name !== 'AbortError') {
          toast({
            title: "Error",
            description: "Could not fetch location suggestions. Please try again.",
            variant: "destructive",
          });
        }
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(fetchPredictions, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [searchQuery, toast]);

  const handleLocationSelect = async (location: Location): Promise<Location | null> => {
    try {
      const details = await getPlaceDetails(location.id);
      if (details) {
        return {
          id: details.id,
          name: details.name,
          area: details.area,
          state: location.state,
          latitude: details.latitude,
          longitude: details.longitude
        };
      }
      return null;
    } catch (error) {
      console.error('Error in handleLocationSelect:', error);
      return null;
    }
  };

  return { locations: predictions, loading, handleLocationSelect };
};
