import { useState, useEffect } from 'react';
import { MarketData } from '../types';

export function useMarketData() {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/market/trending');
        if (!response.ok) throw new Error('Failed to fetch');
        const json = await response.json();
        if (Array.isArray(json)) {
          setData(json);
        } else {
          throw new Error('Invalid data format');
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
