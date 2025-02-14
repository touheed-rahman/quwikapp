
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface LocationContextType {
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => Promise<void>;
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
        const placeId = location.split('|')[1];
        
        const { error } = await supabase
          .from('user_location_preferences')
          .upsert({
            user_id: user.id,
            place_id: placeId
          }, {
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

        const { data: locationPref } = await supabase
          .from('user_location_preferences')
          .select('place_id')
          .single();

        if (locationPref?.place_id) {
          const { data: locationDetails } = await supabase
            .from('location_cache')
            .select('name, area')
            .eq('place_id', locationPref.place_id)
            .single();

          if (locationDetails) {
            setLocationState(`${locationDetails.name}${locationDetails.area ? `, ${locationDetails.area}` : ''}|${locationPref.place_id}`);
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
