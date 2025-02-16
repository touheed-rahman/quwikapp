
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    const apiKey = Deno.env.get('OLA_MAPS_API_KEY')

    if (!apiKey) {
      throw new Error('OLA_MAPS_API_KEY is not configured')
    }

    // Call Ola Maps API for place search
    const response = await fetch(
      `https://api.olamaps.com/v1/places/textsearch?query=${encodeURIComponent(query)}&key=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    const data = await response.json()

    return new Response(
      JSON.stringify(data.results),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
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
