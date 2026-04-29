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
        if (!response.ok) {
          throw new Error(`Server connection error: ${response.status}`);
        }
        
        const json = await response.json();
        if (Array.isArray(json) && json.length > 0) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        console.warn('Market data fetch error, pending retry:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
