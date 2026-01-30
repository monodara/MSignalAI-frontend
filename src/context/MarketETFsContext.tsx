// frontend/src/context/MarketETFsContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useMarketETFs } from '../hooks/useMarketETFs';
import { MarketETF } from '../types';

interface MarketETFsContextType {
  marketETFs: MarketETF[];
  loading: boolean;
  error: string | null;
}

const MarketETFsContext = createContext<MarketETFsContextType | undefined>(undefined);

export const MarketETFsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { marketETFs, loading, error } = useMarketETFs();

  return (
    <MarketETFsContext.Provider value={{ marketETFs, loading, error }}>
      {children}
    </MarketETFsContext.Provider>
  );
};

export const useMarketETFsContext = () => {
  const context = useContext(MarketETFsContext);
  if (context === undefined) {
    throw new Error('useMarketETFsContext must be used within a MarketETFsProvider');
  }
  return context;
};
