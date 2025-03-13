
import { supabase } from '@/integrations/supabase/client';

interface GeocodingResult {
  latitude: number;
  longitude: number;
}

export async function geocodeCity(city: string, state: string): Promise<GeocodingResult | null> {
  try {
    // This is a mock function that would normally call a geocoding API
    // For a real implementation, you would call Google Maps Geocoding API, Mapbox, or similar
    
    // For now, just return placeholder coordinates
    // In a real app, we would use the API to get precise coordinates
    
    const searchParam = `${city}, ${state}, USA`;
    console.log(`Would geocode: ${searchParam}`);
    
    // Simulated response with random coordinates for testing
    const lat = 30 + Math.random() * 10;
    const lng = -100 + Math.random() * 30;
    
    return {
      latitude: lat,
      longitude: lng,
    };
    
    // Real implementation would be something like:
    // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchParam)}&key=${GOOGLE_MAPS_API_KEY}`);
    // const data = await response.json();
    // if (data.results && data.results.length > 0) {
    //   return {
    //     latitude: data.results[0].geometry.location.lat,
    //     longitude: data.results[0].geometry.location.lng,
    //   };
    // }
    // return null;
  } catch (error) {
    console.error('Error geocoding city:', error);
    return null;
  }
}

export async function updateCityCoordinates(): Promise<void> {
  try {
    // Get cities with no coordinates
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, state_id, states!inner(name)')
      .eq('latitude', 0)
      .limit(10); // Process in batches

    if (error) throw error;
    
    if (!cities || cities.length === 0) {
      console.log('No cities need coordinate updates');
      return;
    }
    
    for (const city of cities) {
      // @ts-ignore - states is joined but not in the type
      const stateName = city.states?.name;
      if (!stateName) continue;

      const geoResult = await geocodeCity(city.name, stateName);
      if (geoResult) {
        const { error: updateError } = await supabase
          .from('cities')
          .update({
            latitude: geoResult.latitude,
            longitude: geoResult.longitude
          })
          .eq('id', city.id);
          
        if (updateError) {
          console.error(`Error updating coordinates for ${city.name}:`, updateError);
        } else {
          console.log(`Updated coordinates for ${city.name}, ${stateName}`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error updating city coordinates:', error);
  }
}
