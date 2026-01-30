// frontend/src/components/SearchBar.tsx
import React from 'react';
import { SearchResult } from '../types';
import styles from './SearchBar.module.css'; // Import as CSS module

interface SearchBarProps {
  searchTerm: string;
  searchResults: SearchResult[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectStock: (symbol: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  searchResults,
  onSearchChange,
  onSelectStock,
  loading,
}) => {
  return (
    <div className={styles['search-bar-container']}>
      <input
        type="text"
        className={styles['search-box']} // Corrected class name
        placeholder="Search for a stock..."
        value={searchTerm}
        onChange={onSearchChange}
      />
      {loading && <div className={styles['loading-indicator']}>Searching...</div>}
      {searchResults.length > 0 && (
        <ul className={styles['search-results']}>
          {searchResults.map((result) => (
            <li
              key={result.symbol}
              className={styles['search-results-item']} // Added class name
              onClick={() => onSelectStock(result.symbol)}
            >
              {result.symbol} - {result.instrument_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
