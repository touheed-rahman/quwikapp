
export interface Location {
  id: string;
  name: string;
  state: string;
  state_id: string;
  latitude: number;
  longitude: number;
}

export interface LocationSelectorProps {
  value: string | null;
  onChange: (location: string | null) => void;
}

export interface State {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  state_id: string;
  latitude: number;
  longitude: number;
}
