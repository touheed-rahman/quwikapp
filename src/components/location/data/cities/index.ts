
import { City } from '../../types';
import { andhraPradeshCities } from './india/andhra-pradesh-cities';
import { arunachalPradeshCities } from './india/arunachal-pradesh-cities';
import { assamCities } from './india/assam-cities';
import { biharCities } from './india/bihar-cities';
import { chhattisgarhCities } from './india/chhattisgarh-cities';
import { goaCities } from './india/goa-cities';
import { gujaratCities } from './india/gujarat-cities';
import { haryanaCities } from './india/haryana-cities';

export const getCitiesByState = (stateId: string): City[] => {
  switch (stateId) {
    case 'in-1': // Andhra Pradesh
      return andhraPradeshCities;
    case 'in-2': // Arunachal Pradesh
      return arunachalPradeshCities;
    case 'in-3': // Assam
      return assamCities;
    case 'in-4': // Bihar
      return biharCities;
    case 'in-5': // Chhattisgarh
      return chhattisgarhCities;
    case 'in-6': // Goa
      return goaCities;
    case 'in-7': // Gujarat
      return gujaratCities;
    case 'in-8': // Haryana
      return haryanaCities;
    default:
      return [];
  }
};
