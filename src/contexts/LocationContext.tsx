
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface LocationContextType {
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => Promise<void>;
}

interface UserLocationPreference {
  id: string;
  user_id: string;
  city_id: string;
  created_at: string;
  updated_at: string;
}

// Update the interface to properly handle potential error from Supabase
interface CityDetails {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  states: {
    id: string;
    name: string;
    countries: {
      id: string;
      name: string;
    } | null; // Make countries nullable to handle potential errors
  };
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedLocation, setLocationState] = useState<string | null>(null);

  const setSelectedLocation = async (location: string | null) => {
    setLocationState(location);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (location) {
        const locationParts = location.split('|');
        const cityId = locationParts[5]; // New format has cityId at index 5
        
        const { error } = await supabase
          .from('user_location_preferences')
          .upsert({
            id: crypto.randomUUID(),
            user_id: user.id,
            city_id: cityId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as UserLocationPreference, {
            onConflict: 'user_id'
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving location preference:', error);
    }
  };

  useEffect(() => {
    const loadUserLocation = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: locationPref, error: prefError } = await supabase
          .from('user_location_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (prefError && prefError.code !== 'PGRST116') throw prefError;

        if (locationPref?.city_id) {
          const { data: cityDetails, error: cityError } = await supabase
            .from('cities')
            .select('*, states(id, name, countries(id, name))')
            .eq('id', locationPref.city_id)
            .single();

          if (cityError) throw cityError;

          if (cityDetails) {
            // Check if we have a valid city with states and countries data
            const details = cityDetails as unknown as CityDetails;
            
            // Handle the case where countries data might be missing or have an error
            if (details && details.states && details.states.countries) {
              const locationString = `${details.name}|${details.states.name}|${details.states.countries.name}|${details.latitude}|${details.longitude}|${details.id}|${details.states.id}|${details.states.countries.id}`;
              setLocationState(locationString);
            } else {
              console.error('Missing countries data in city details:', details);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user location:', error);
      }
    };

    loadUserLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
