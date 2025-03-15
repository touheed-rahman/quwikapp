
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
    case '9': // China
      return [
        { id: `${countryId}-1`, name: 'Beijing' },
        { id: `${countryId}-2`, name: 'Shanghai' },
        { id: `${countryId}-3`, name: 'Guangdong' },
        { id: `${countryId}-4`, name: 'Sichuan' },
        { id: `${countryId}-5`, name: 'Zhejiang' }
      ];
    case '10': // Brazil
      return [
        { id: `${countryId}-1`, name: 'São Paulo' },
        { id: `${countryId}-2`, name: 'Rio de Janeiro' },
        { id: `${countryId}-3`, name: 'Minas Gerais' },
        { id: `${countryId}-4`, name: 'Bahia' },
        { id: `${countryId}-5`, name: 'Rio Grande do Sul' }
      ];
    case '11': // Mexico
      return [
        { id: `${countryId}-1`, name: 'Mexico City' },
        { id: `${countryId}-2`, name: 'Jalisco' },
        { id: `${countryId}-3`, name: 'Nuevo León' },
        { id: `${countryId}-4`, name: 'Puebla' },
        { id: `${countryId}-5`, name: 'Veracruz' }
      ];
    case '12': // Italy
      return [
        { id: `${countryId}-1`, name: 'Lombardy' },
        { id: `${countryId}-2`, name: 'Lazio' },
        { id: `${countryId}-3`, name: 'Campania' },
        { id: `${countryId}-4`, name: 'Sicily' },
        { id: `${countryId}-5`, name: 'Veneto' }
      ];
    case '13': // Spain
      return [
        { id: `${countryId}-1`, name: 'Madrid' },
        { id: `${countryId}-2`, name: 'Catalonia' },
        { id: `${countryId}-3`, name: 'Andalusia' },
        { id: `${countryId}-4`, name: 'Valencia' },
        { id: `${countryId}-5`, name: 'Galicia' }
      ];
    default:
      // For other countries, provide generic but realistic regions
      return [
        { id: `${countryId}-1`, name: 'Capital Region' },
        { id: `${countryId}-2`, name: 'Northern Region' },
        { id: `${countryId}-3`, name: 'Southern Region' },
        { id: `${countryId}-4`, name: 'Eastern Region' },
        { id: `${countryId}-5`, name: 'Western Region' }
      ];
  }
};
