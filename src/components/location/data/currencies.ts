
export interface CurrencyInfo {
  symbol: string;
  code: string;
  position: 'before' | 'after';
}

export const countryCurrencies: Record<string, CurrencyInfo> = {
  '1': { symbol: '$', code: 'USD', position: 'before' }, // US
  '2': { symbol: '₹', code: 'INR', position: 'before' }, // India
  '3': { symbol: 'C$', code: 'CAD', position: 'before' }, // Canada
  '4': { symbol: '£', code: 'GBP', position: 'before' }, // UK
  '5': { symbol: 'A$', code: 'AUD', position: 'before' }, // Australia
  '6': { symbol: '€', code: 'EUR', position: 'before' }, // Germany
  '7': { symbol: '€', code: 'EUR', position: 'before' }, // France
  '8': { symbol: '¥', code: 'JPY', position: 'before' }, // Japan
  '9': { symbol: '¥', code: 'CNY', position: 'before' }, // China
  '10': { symbol: 'R$', code: 'BRL', position: 'before' }, // Brazil
  '11': { symbol: 'Mex$', code: 'MXN', position: 'before' }, // Mexico
  '12': { symbol: '€', code: 'EUR', position: 'before' }, // Italy
  '13': { symbol: '€', code: 'EUR', position: 'before' }, // Spain
  '14': { symbol: '€', code: 'EUR', position: 'before' }, // Netherlands
  '15': { symbol: 'kr', code: 'SEK', position: 'after' }, // Sweden
  '16': { symbol: 'kr', code: 'NOK', position: 'after' }, // Norway
  '17': { symbol: 'kr', code: 'DKK', position: 'after' }, // Denmark
  '18': { symbol: '€', code: 'EUR', position: 'before' }, // Finland
  '19': { symbol: '€', code: 'EUR', position: 'before' }, // Belgium
  '20': { symbol: 'Fr', code: 'CHF', position: 'after' }, // Switzerland
  '21': { symbol: '€', code: 'EUR', position: 'before' }, // Austria
  '22': { symbol: '€', code: 'EUR', position: 'before' }, // Portugal
  '23': { symbol: '€', code: 'EUR', position: 'before' }, // Greece
  '24': { symbol: '€', code: 'EUR', position: 'before' }, // Ireland
  '25': { symbol: 'zł', code: 'PLN', position: 'after' }, // Poland
  '26': { symbol: '₽', code: 'RUB', position: 'after' }, // Russia
  '27': { symbol: '₺', code: 'TRY', position: 'before' }, // Turkey
  '28': { symbol: 'R', code: 'ZAR', position: 'before' }, // South Africa
  '29': { symbol: '₦', code: 'NGN', position: 'before' }, // Nigeria
  '30': { symbol: 'E£', code: 'EGP', position: 'before' }, // Egypt
  // Add more countries with their currencies
};

// Default currency if no country is selected
export const defaultCurrency: CurrencyInfo = { symbol: '$', code: 'USD', position: 'before' };

export const formatCurrency = (amount: number, currencyInfo: CurrencyInfo): string => {
  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return currencyInfo.position === 'before' 
    ? `${currencyInfo.symbol}${formattedAmount}` 
    : `${formattedAmount} ${currencyInfo.symbol}`;
};
