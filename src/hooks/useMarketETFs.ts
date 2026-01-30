// frontend/src/hooks/useMarketETFs.ts
import { useState, useEffect } from 'react';
import { fetchMarketETFs } from '../services/api';
import { MarketETF } from '../types';

export function useMarketETFs() {
  const [marketETFs, setMarketETFs] = useState<MarketETF[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMarketETFs = async () => {
      try {
        setLoading(true);
        const etfs = await fetchMarketETFs();
        setMarketETFs(etfs);
      } catch (err) {
        setError('Failed to fetch market ETFs.');
        console.error('Error fetching market ETFs:', err);
      } finally {
        setLoading(false);
      }
    };
    getMarketETFs();
  }, []);

  return { marketETFs, loading, error };
}
