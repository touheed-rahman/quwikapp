
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlacePrediction, Location, PlaceDetails } from './types';

export const useLocationSearch = (searchQuery: string) => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const abortController = useRef<AbortController>();

  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
    try {
      console.log('Fetching place details for:', placeId);
      const { data, error } = await supabase.functions.invoke('places', {
        body: {
          endpoint: 'details',
          place_id: placeId
        }
      });

      if (error) {
        console.error('Place details error:', error);
        throw error;
      }

      console.log('Place details response:', data);
      
      if (data.status === 'OK' && data.result) {
        const result = data.result;
        return {
          place_id: placeId,
          name: result.name,
          area: result.formatted_address,
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  const cacheLocation = async (details: PlaceDetails) => {
    try {
      const { error } = await supabase
        .from('location_cache')
        .upsert({
          place_id: details.place_id,
          name: details.name,
          area: details.area,
          latitude: details.latitude,
          longitude: details.longitude,
          coordinates: `POINT(${details.longitude} ${details.latitude})`
        });

      if (error) {
        console.error('Error caching location:', error);
      }
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
      try {
        if (abortController.current) {
          abortController.current.abort();
        }
        abortController.current = new AbortController();

        setLoading(true);
        console.log('Fetching predictions for query:', searchQuery);
        
        const { data, error } = await supabase.functions.invoke('places', {
          body: {
            endpoint: 'autocomplete',
            input: searchQuery
          }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw error;
        }

        console.log('Predictions response:', data);
        
        if (data.status === 'OK' && Array.isArray(data.predictions)) {
          setPredictions(data.predictions);
        } else if (data.error_message) {
          console.error('Google Places API error:', data.error_message);
          toast({
            title: "Error",
            description: "There was an error fetching locations. Please try again.",
            variant: "destructive",
          });
          setPredictions([]);
        } else {
          console.error('Unexpected response format:', data);
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

  const handleLocationSelect = async (location: Location | PlacePrediction): Promise<Location | null> => {
    try {
      console.log('Handling location select:', location);
      const placeId = location.place_id;
      if (!placeId) return null;

      const details = await getPlaceDetails(placeId);
      if (details) {
        await cacheLocation(details);
        return {
          id: details.place_id,
          name: details.name,
          area: details.area,
          place_id: details.place_id,
          latitude: details.latitude,
          longitude: details.longitude,
          structured_formatting: {
            main_text: details.name,
            secondary_text: details.area || ''
          }
        };
      }
      return null;
    } catch (error) {
      console.error('Error in handleLocationSelect:', error);
      return null;
    }
  };

  const locations: Location[] = predictions?.map(prediction => ({
    id: prediction.place_id,
    name: prediction.structured_formatting.main_text,
    area: prediction.structured_formatting.secondary_text,
    place_id: prediction.place_id,
    description: prediction.description,
    structured_formatting: prediction.structured_formatting
  })) || [];

  return { locations, loading, handleLocationSelect };
};
