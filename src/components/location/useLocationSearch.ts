
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Location } from './types';
import { toast } from "@/hooks/use-toast";

export const useLocationSearch = (searchQuery: string) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch location suggestions based on user input
  const fetchLocations = async (query: string) => {
    if (!query?.trim()) {
      setLocations([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('places', {
        body: {
          endpoint: 'autocomplete',
          input: query,
        },
      });

      if (error) throw error;

      if (!data?.predictions) {
        console.error('No predictions in response:', data);
        throw new Error('Failed to get location suggestions');
      }

      const suggestions = data.predictions.map((prediction: any) => ({
        description: prediction.description,
        place_id: prediction.place_id,
        name: prediction.structured_formatting?.main_text || prediction.description,
      }));

      console.log('Location suggestions:', suggestions);
      setLocations(suggestions);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch location suggestions. Please try again.",
        variant: "destructive",
      });
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  // Get detailed information for a selected location
  const handleLocationSelect = async (location: Location) => {
    try {
      console.log('Fetching details for location:', location);
      const { data, error } = await supabase.functions.invoke('places', {
        body: {
          endpoint: 'details',
          place_id: location.place_id,
        },
      });

      if (error) throw error;

      if (!data?.result) {
        console.error('No result in response:', data);
        throw new Error('Failed to get location details');
      }

      console.log('Location details:', data.result);
      return {
        name: location.name,
        place_id: location.place_id,
        formatted_address: data.result.formatted_address,
        geometry: data.result.geometry,
      };
    } catch (error) {
      console.error('Error fetching location details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch location details. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Use effect to fetch locations when search query changes with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchLocations(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return {
    locations,
    loading,
    handleLocationSelect,
  };
};
