
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PlacesRequest {
  endpoint: 'autocomplete' | 'details'
  input?: string
  place_id?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { endpoint, input, place_id } = await req.json() as PlacesRequest
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY')

    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Missing Google Maps API key')
    }

    let url: string
    if (endpoint === 'autocomplete') {
      if (!input?.trim()) {
        throw new Error('Input is required for autocomplete')
      }
      url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&components=country:in&key=${GOOGLE_MAPS_API_KEY}&types=(cities)`
    } else if (endpoint === 'details') {
      if (!place_id?.trim()) {
        throw new Error('Place ID is required for details')
      }
      url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_MAPS_API_KEY}&fields=geometry,name,formatted_address,address_components`
    } else {
      throw new Error('Invalid endpoint')
    }

    console.log('Making request to Google Places API:', url.replace(GOOGLE_MAPS_API_KEY, '[REDACTED]'))

    const response = await fetch(url)
    const data = await response.json()

    if (endpoint === 'details' && data.status === 'OK') {
      // Cache the location details in the location_cache table
      const { result } = data
      const { geometry, formatted_address, place_id: resultPlaceId } = result
      
      if (geometry?.location) {
        const { lat, lng } = geometry.location
        
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Update or insert into location_cache
        await supabaseClient
          .from('location_cache')
          .upsert({
            place_id: resultPlaceId,
            name: formatted_address,
            latitude: lat,
            longitude: lng,
            coordinates: `POINT(${lng} ${lat})`,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'place_id'
          })
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
