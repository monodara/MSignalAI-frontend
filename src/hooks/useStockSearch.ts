// frontend/src/hooks/useStockSearch.ts
import { useState, useRef } from 'react';
import { searchStocks } from '../services/api';
import { SearchResult } from '../types';

export function useStockSearch() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (value.length > 1) {
      setLoading(true);
      setError(null);
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchStocks(value);
          setSearchResults(results);
        } catch (err) {
          setError('Failed to search stocks.');
          console.error('Error searching stocks:', err);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return {
    searchTerm,
    searchResults,
    loading,
    error,
    handleSearchChange,
    clearSearch,
  };
}
