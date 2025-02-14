
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY')

    if (!API_KEY) {
      console.error('Missing Google Maps API key')
      throw new Error('Missing Google Maps API key')
    }

    const { endpoint, input, place_id } = await req.json() as PlacesRequest

    let url: string
    if (endpoint === 'autocomplete') {
      if (!input?.trim()) {
        console.error('Empty input for autocomplete')
        throw new Error('Input is required for autocomplete')
      }
      url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&components=country:in&key=${API_KEY}&types=(cities)`
    } else if (endpoint === 'details') {
      if (!place_id?.trim()) {
        console.error('Empty place_id for details')
        throw new Error('Place ID is required for details')
      }
      url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${API_KEY}&fields=geometry,name,formatted_address,address_components`
    } else {
      console.error('Invalid endpoint requested:', endpoint)
      throw new Error('Invalid endpoint')
    }

    console.log('Making request to Google Places API:', url.replace(API_KEY, '[REDACTED]'))

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(url, {
        signal: controller.signal
      })
      clearTimeout(timeout)

      if (!response.ok) {
        console.error('Google Places API HTTP error:', response.status)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      console.log('Google Places API Response:', {
        status: data.status,
        errorMessage: data.error_message,
        hasResults: endpoint === 'autocomplete' ? 
          (data.predictions?.length > 0) : 
          (data.result != null)
      })

      if (data.status === 'ZERO_RESULTS') {
        // Return empty results instead of throwing error
        return new Response(JSON.stringify({
          status: 'OK',
          [endpoint === 'autocomplete' ? 'predictions' : 'result']: []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (data.status !== 'OK') {
        throw new Error(data.error_message || `Google Places API error: ${data.status}`)
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (error) {
      clearTimeout(timeout)
      throw error
    }
  } catch (error) {
    console.error('Edge Function Error:', error.message)
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'If you recently enabled billing, it may take a few minutes to propagate. Please ensure the Places API is enabled in your Google Cloud Console.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
