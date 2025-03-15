
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
        { id: `${countryId}-1`, name: 'Beijing Municipality' },
        { id: `${countryId}-2`, name: 'Shanghai Municipality' },
        { id: `${countryId}-3`, name: 'Guangdong Province' },
        { id: `${countryId}-4`, name: 'Sichuan Province' },
        { id: `${countryId}-5`, name: 'Zhejiang Province' },
        { id: `${countryId}-6`, name: 'Jiangsu Province' },
        { id: `${countryId}-7`, name: 'Henan Province' },
        { id: `${countryId}-8`, name: 'Shandong Province' }
      ];
    case '10': // Brazil
      return [
        { id: `${countryId}-1`, name: 'São Paulo' },
        { id: `${countryId}-2`, name: 'Rio de Janeiro' },
        { id: `${countryId}-3`, name: 'Minas Gerais' },
        { id: `${countryId}-4`, name: 'Bahia' },
        { id: `${countryId}-5`, name: 'Rio Grande do Sul' },
        { id: `${countryId}-6`, name: 'Paraná' },
        { id: `${countryId}-7`, name: 'Pernambuco' },
        { id: `${countryId}-8`, name: 'Ceará' }
      ];
    case '11': // Mexico
      return [
        { id: `${countryId}-1`, name: 'Mexico City' },
        { id: `${countryId}-2`, name: 'Jalisco' },
        { id: `${countryId}-3`, name: 'Nuevo León' },
        { id: `${countryId}-4`, name: 'Puebla' },
        { id: `${countryId}-5`, name: 'Veracruz' },
        { id: `${countryId}-6`, name: 'Guanajuato' },
        { id: `${countryId}-7`, name: 'Chihuahua' },
        { id: `${countryId}-8`, name: 'Baja California' }
      ];
    case '12': // Italy
      return [
        { id: `${countryId}-1`, name: 'Lombardy' },
        { id: `${countryId}-2`, name: 'Lazio' },
        { id: `${countryId}-3`, name: 'Campania' },
        { id: `${countryId}-4`, name: 'Sicily' },
        { id: `${countryId}-5`, name: 'Veneto' },
        { id: `${countryId}-6`, name: 'Piedmont' },
        { id: `${countryId}-7`, name: 'Emilia-Romagna' },
        { id: `${countryId}-8`, name: 'Tuscany' }
      ];
    case '13': // Spain
      return [
        { id: `${countryId}-1`, name: 'Madrid' },
        { id: `${countryId}-2`, name: 'Catalonia' },
        { id: `${countryId}-3`, name: 'Andalusia' },
        { id: `${countryId}-4`, name: 'Valencia' },
        { id: `${countryId}-5`, name: 'Galicia' },
        { id: `${countryId}-6`, name: 'Basque Country' },
        { id: `${countryId}-7`, name: 'Castile and León' },
        { id: `${countryId}-8`, name: 'Canary Islands' }
      ];
    default:
      // For other countries, provide realistic regions
      return [
        { id: `${countryId}-1`, name: 'North Region' },
        { id: `${countryId}-2`, name: 'South Region' },
        { id: `${countryId}-3`, name: 'East Region' },
        { id: `${countryId}-4`, name: 'West Region' },
        { id: `${countryId}-5`, name: 'Central Region' },
        { id: `${countryId}-6`, name: 'Capital Region' },
        { id: `${countryId}-7`, name: 'Coastal Region' },
        { id: `${countryId}-8`, name: 'Mountain Region' }
      ];
  }
};
