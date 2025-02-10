
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlacePrediction, Location, PlaceDetails } from './types';

export const useLocationSearch = (searchQuery: string) => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('places', {
        body: {
          endpoint: 'details',
          place_id: placeId
        }
      });

      if (error) {
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
          longitude: details.longitude
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
        setLoading(true);
        
        const { data, error } = await supabase.functions.invoke('places', {
          body: {
            endpoint: 'autocomplete',
            input: searchQuery
          }
        });

        if (error) {
          throw error;
        }

        console.log('Predictions response:', data);
        
        if (data.status === 'OK' && Array.isArray(data.predictions)) {
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

  const handleLocationSelect = async (location: Location | PlacePrediction): Promise<Location | null> => {
    try {
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
