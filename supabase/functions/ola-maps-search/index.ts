
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    console.log('Received search query:', query)

    if (!query || typeof query !== 'string') {
      throw new Error('Query parameter is required and must be a string')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check cache first
    const { data: cachedLocations, error: cacheError } = await supabaseClient
      .from('location_cache')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(5)

    if (cacheError) {
      console.error('Cache lookup error:', cacheError)
    } else if (cachedLocations && cachedLocations.length > 0) {
      console.log('Returning cached results')
      return new Response(
        JSON.stringify(cachedLocations.map(location => ({
          place_id: location.place_id,
          name: location.name,
          formatted_address: location.area,
          geometry: {
            location: {
              lat: location.latitude,
              lng: location.longitude
            }
          }
        }))),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    }

    // If not in cache, fetch from Google Places API
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured')
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('Google Places API error:', await response.text())
      throw new Error(`Google Places API returned ${response.status}`)
    }

    const data = await response.json()
    const places: Place[] = data.results

    // Cache the results
    if (places.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('location_cache')
        .upsert(
          places.map(place => ({
            place_id: place.place_id,
            name: place.name,
            area: place.formatted_address,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng
          }))
        )

      if (insertError) {
        console.error('Error caching locations:', insertError)
      }
    }

    return new Response(
      JSON.stringify(places),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error in places-search function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
