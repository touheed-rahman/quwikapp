
export interface Location {
  id: string;
  name: string;
  area?: string;
  place_id?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  distance_km?: number;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

export interface LocationSelectorProps {
  value: string | null;
  onChange: (location: string | null) => void;
}

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  area?: string;
  latitude: number;
  longitude: number;
}
