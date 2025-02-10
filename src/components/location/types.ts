
export interface Location {
  id: string;
  name: string;
  area?: string;
  place_id?: string;
  description?: string;
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
