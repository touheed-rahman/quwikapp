import { City } from '../../types';
import { andhraPradeshCities } from './india/andhra-pradesh-cities';
import { arunachalPradeshCities } from './india/arunachal-pradesh-cities';
import { assamCities } from './india/assam-cities';
import { biharCities } from './india/bihar-cities';
import { chhattisgarhCities } from './india/chhattisgarh-cities';
import { goaCities } from './india/goa-cities';
import { gujaratCities } from './india/gujarat-cities';
import { haryanaCities } from './india/haryana-cities';
import { karnatakaCities } from './india/karnataka-cities';
import { keralaCities } from './india/kerala-cities';
import { maharashtraCities } from './india/maharashtra-cities';
import { tamilNaduCities } from './india/tamil-nadu-cities';
import { telanganaCities } from './india/telangana-cities';
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
    case 'in-11': return karnatakaCities;
    case 'in-12': return keralaCities;
    case 'in-14': return maharashtraCities;
    case 'in-23': return tamilNaduCities;
    case 'in-24': return telanganaCities;
    
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
    
    // Default cases for all other regions, using realistic city names
    default:
      // Check country code from state ID
      const countryCode = stateId.split('-')[0];
      
      // China
      if (countryCode === '9') {
        if (stateId === '9-1') { // Beijing
          return [
            { id: `${stateId}-city1`, name: 'Beijing', state_id: stateId, latitude: 39.9042, longitude: 116.4074 },
            { id: `${stateId}-city2`, name: 'Tongzhou', state_id: stateId, latitude: 39.9054, longitude: 116.6561 },
            { id: `${stateId}-city3`, name: 'Daxing', state_id: stateId, latitude: 39.7270, longitude: 116.3385 }
          ];
        } else if (stateId === '9-2') { // Shanghai
          return [
            { id: `${stateId}-city1`, name: 'Shanghai', state_id: stateId, latitude: 31.2304, longitude: 121.4737 },
            { id: `${stateId}-city2`, name: 'Pudong', state_id: stateId, latitude: 31.2231, longitude: 121.5397 },
            { id: `${stateId}-city3`, name: 'Jiading', state_id: stateId, latitude: 31.3838, longitude: 121.2426 }
          ];
        } else if (stateId === '9-3') { // Guangdong
          return [
            { id: `${stateId}-city1`, name: 'Guangzhou', state_id: stateId, latitude: 23.1291, longitude: 113.2644 },
            { id: `${stateId}-city2`, name: 'Shenzhen', state_id: stateId, latitude: 22.5431, longitude: 114.0579 },
            { id: `${stateId}-city3`, name: 'Dongguan', state_id: stateId, latitude: 23.0489, longitude: 113.7447 }
          ];
        }
      }
      
      // Brazil
      else if (countryCode === '10') {
        if (stateId === '10-1') { // São Paulo
          return [
            { id: `${stateId}-city1`, name: 'São Paulo', state_id: stateId, latitude: -23.5505, longitude: -46.6333 },
            { id: `${stateId}-city2`, name: 'Campinas', state_id: stateId, latitude: -22.9071, longitude: -47.0632 },
            { id: `${stateId}-city3`, name: 'Santos', state_id: stateId, latitude: -23.9618, longitude: -46.3322 }
          ];
        } else if (stateId === '10-2') { // Rio de Janeiro
          return [
            { id: `${stateId}-city1`, name: 'Rio de Janeiro', state_id: stateId, latitude: -22.9068, longitude: -43.1729 },
            { id: `${stateId}-city2`, name: 'Niterói', state_id: stateId, latitude: -22.8832, longitude: -43.1036 },
            { id: `${stateId}-city3`, name: 'Petrópolis', state_id: stateId, latitude: -22.5126, longitude: -43.1778 }
          ];
        }
      }
      
      // Other countries - generate more specific city names based on the region
      const stateIdParts = stateId.split('-');
      const regionId = stateIdParts[1] ? parseInt(stateIdParts[1]) : 0;
      
      // Get region type (North, South, etc.) based on region ID
      let regionType = '';
      if (regionId === 1) regionType = 'Capital';
      else if (regionId === 2) regionType = 'Northern';
      else if (regionId === 3) regionType = 'Southern';
      else if (regionId === 4) regionType = 'Eastern';
      else if (regionId === 5) regionType = 'Western';
      else regionType = 'Central';
      
      return [
        { id: `${stateId}-city1`, name: `${regionType} Capital`, state_id: stateId, latitude: 0, longitude: 0 },
        { id: `${stateId}-city2`, name: `${regionType} Port City`, state_id: stateId, latitude: 0, longitude: 0 },
        { id: `${stateId}-city3`, name: `${regionType} Valley`, state_id: stateId, latitude: 0, longitude: 0 },
        { id: `${stateId}-city4`, name: `${regionType} Heights`, state_id: stateId, latitude: 0, longitude: 0 },
        { id: `${stateId}-city5`, name: `${regionType} Junction`, state_id: stateId, latitude: 0, longitude: 0 },
      ];
  }
};
