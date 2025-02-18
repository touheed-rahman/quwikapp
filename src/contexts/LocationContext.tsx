
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

interface CityDetails {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  states: {
    name: string;
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
        const cityId = location.split('|')[4];
        
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

        if (prefError) throw prefError;

        if (locationPref?.city_id) {
          const { data: cityDetails, error: cityError } = await supabase
            .from('cities')
            .select('*, states(name)')
            .eq('id', locationPref.city_id)
            .single();

          if (cityError) throw cityError;

          if (cityDetails) {
            const details = cityDetails as CityDetails;
            const locationString = `${details.name}|${details.states.name}|${details.latitude}|${details.longitude}|${details.id}`;
            setLocationState(locationString);
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
