
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { countryCurrencies, defaultCurrency, CurrencyInfo } from '@/components/location/data/currencies';

interface CurrencyContextType {
  currency: CurrencyInfo;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: defaultCurrency,
  formatPrice: (amount: number) => `${defaultCurrency.symbol}${amount}`,
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const { selectedLocation } = useLocation();
  const [currency, setCurrency] = useState<CurrencyInfo>(defaultCurrency);

  useEffect(() => {
    if (selectedLocation) {
      const parts = selectedLocation.split('|');
      if (parts.length >= 3) {
        // Find the country in the location string
        const countryName = parts[2]; // Country is the third part
        
        // Find country ID from name
        const countryEntry = Object.entries(countryCurrencies).find(([_, country]) => {
          const countryId = Object.entries(countryCurrencies).find(
            ([id, _]) => countryCurrencies[id].code === country.code
          );
          return countryId;
        });
        
        if (countryEntry) {
          setCurrency(countryCurrencies[countryEntry[0]]);
        } else {
          // If we can't determine the country, use default
          setCurrency(defaultCurrency);
        }
      }
    }
  }, [selectedLocation]);

  // Function to format price based on the current currency
  const formatPrice = (amount: number): string => {
    const formattedAmount = amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    return currency.position === 'before' 
      ? `${currency.symbol}${formattedAmount}` 
      : `${formattedAmount} ${currency.symbol}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
