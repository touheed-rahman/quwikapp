
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Location } from './types';

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

      const suggestions = data.predictions?.map((prediction: any) => ({
        description: prediction.description,
        place_id: prediction.place_id,
        name: prediction.structured_formatting?.main_text || prediction.description,
      })) || [];

      setLocations(suggestions);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  // Get detailed information for a selected location
  const handleLocationSelect = async (location: Location) => {
    try {
      const { data, error } = await supabase.functions.invoke('places', {
        body: {
          endpoint: 'details',
          place_id: location.place_id,
        },
      });

      if (error) throw error;

      if (data.result) {
        return {
          name: location.name,
          place_id: location.place_id,
          formatted_address: data.result.formatted_address,
          geometry: data.result.geometry,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching location details:', error);
      return null;
    }
  };

  // Use effect to fetch locations when search query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLocations(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return {
    locations,
    loading,
    handleLocationSelect,
  };
};
