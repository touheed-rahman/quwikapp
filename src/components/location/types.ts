
export interface Location {
  description: string;
  place_id: string;
  name: string;
}

export interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationDetails {
  name: string;
  place_id: string;
  formatted_address: string;
  geometry: {
    location: LocationCoordinates;
    viewport?: {
      northeast: LocationCoordinates;
      southwest: LocationCoordinates;
    };
  };
}
