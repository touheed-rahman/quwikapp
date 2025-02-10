
import { serve } from 'https://deno.fresh.run/std@0.168.0/http/server.ts'

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!API_KEY) {
      throw new Error('Missing Google Maps API key')
    }

    const { endpoint, input, place_id } = await req.json() as PlacesRequest

    let url: string
    if (endpoint === 'autocomplete') {
      url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input || ''
      )}&components=country:in&key=${API_KEY}&types=(cities)`
    } else if (endpoint === 'details') {
      url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${API_KEY}&fields=geometry,name,formatted_address`
    } else {
      throw new Error('Invalid endpoint')
    }

    const response = await fetch(url)
    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
