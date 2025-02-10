
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
      const { data: apiKey } = await supabase.rpc('get_secret', {
        name: 'OLA_MAPS_API_KEY'
      });

      if (!apiKey) {
        console.error('Maps API key not found');
        return null;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=geometry,name,formatted_address`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch place details');
      }

      const data = await response.json();
      
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

  const handleLocationSelect = async (prediction: PlacePrediction): Promise<Location | null> => {
    const details = await getPlaceDetails(prediction.place_id);
    if (details) {
      await cacheLocation(details);
      return {
        id: details.place_id,
        name: details.name,
        area: details.area,
        place_id: details.place_id,
        latitude: details.latitude,
        longitude: details.longitude
      };
    }
    return null;
  };

  const locations: Location[] = predictions.map(prediction => ({
    id: prediction.place_id,
    name: prediction.structured_formatting.main_text,
    area: prediction.structured_formatting.secondary_text,
    place_id: prediction.place_id,
    description: prediction.description
  }));

  return { locations, loading, handleLocationSelect };
};
