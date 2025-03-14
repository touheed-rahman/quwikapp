
import { State } from '../../types';
import { usStates } from './us-states';
import { indiaStates } from './india-states';
import { canadaStates } from './canada-states';
import { ukStates } from './uk-states';
import { australiaStates } from './australia-states';
import { germanyStates } from './germany-states';
import { franceStates } from './france-states';
import { japanStates } from './japan-states';

export const getStatesByCountry = (countryId: string): State[] => {
  switch (countryId) {
    case '1': // US
      return usStates;
    case '2': // India
      return indiaStates;
    case '3': // Canada
      return canadaStates;
    case '4': // UK
      return ukStates;
    case '5': // Australia
      return australiaStates;
    case '6': // Germany
      return germanyStates;
    case '7': // France
      return franceStates;
    case '8': // Japan
      return japanStates;
    default:
      return [
        { id: `${countryId}-1`, name: 'Major Region 1' },
        { id: `${countryId}-2`, name: 'Major Region 2' },
        { id: `${countryId}-3`, name: 'Major Region 3' },
        { id: `${countryId}-4`, name: 'Major Region 4' },
        { id: `${countryId}-5`, name: 'Major Region 5' }
      ];
  }
};
