
export interface Location {
  id: string;
  name: string;
  area?: string;
  state: string;
  latitude: number;
  longitude: number;
  description?: string;
  distance_km?: number;
}

export interface LocationSelectorProps {
  value: string | null;
  onChange: (location: string | null) => void;
}

export interface PlacePrediction {
  id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  id: string;
  name: string;
  area?: string;
  latitude: number;
  longitude: number;
}
