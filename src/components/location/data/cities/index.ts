
import { City } from '../../types';
import { andhraPradeshCities } from './india/andhra-pradesh-cities';
import { arunachalPradeshCities } from './india/arunachal-pradesh-cities';
import { assamCities } from './india/assam-cities';
import { biharCities } from './india/bihar-cities';
import { chhattisgarhCities } from './india/chhattisgarh-cities';
import { goaCities } from './india/goa-cities';
import { gujaratCities } from './india/gujarat-cities';
import { haryanaCities } from './india/haryana-cities';
import { californiaCities } from './usa/california-cities';
import { texasCities } from './usa/texas-cities';
import { newYorkCities } from './usa/new-york-cities';
import { floridaCities } from './usa/florida-cities';
import { englandCities } from './uk/england-cities';
import { scotlandCities } from './uk/scotland-cities';
import { ontarioCities } from './canada/ontario-cities';
import { quebecCities } from './canada/quebec-cities';

export const getCitiesByState = (stateId: string): City[] => {
  switch (stateId) {
    // India states
    case 'in-1': return andhraPradeshCities;
    case 'in-2': return arunachalPradeshCities;
    case 'in-3': return assamCities;
    case 'in-4': return biharCities;
    case 'in-5': return chhattisgarhCities;
    case 'in-6': return goaCities;
    case 'in-7': return gujaratCities;
    case 'in-8': return haryanaCities;
    
    // US states
    case 'us-5': return californiaCities;
    case 'us-43': return texasCities;
    case 'us-32': return newYorkCities;
    case 'us-9': return floridaCities;
    
    // UK regions
    case 'uk-1': return englandCities;
    case 'uk-2': return scotlandCities;
    
    // Canada provinces
    case 'ca-9': return ontarioCities;
    case 'ca-11': return quebecCities;
    
    default:
      return [
        { id: `${stateId}-city1`, name: 'Major City 1', state_id: stateId, latitude: 0, longitude: 0 },
        { id: `${stateId}-city2`, name: 'Major City 2', state_id: stateId, latitude: 0, longitude: 0 },
        { id: `${stateId}-city3`, name: 'Major City 3', state_id: stateId, latitude: 0, longitude: 0 },
        { id: `${stateId}-city4`, name: 'Major City 4', state_id: stateId, latitude: 0, longitude: 0 },
        { id: `${stateId}-city5`, name: 'Major City 5', state_id: stateId, latitude: 0, longitude: 0 },
      ];
  }
};
