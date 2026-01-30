// frontend/src/components/Layout.tsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import SearchBar from './SearchBar'; // Import SearchBar
import { useStockSearch } from '../hooks/useStockSearch';
import ErrorDisplay from './ErrorDisplay';
import appStyles from '../App.module.css'; // Import App.module.css for global styles

// Removed LayoutProps interface

const Layout: React.FC = () => { // Removed setShowAIDialog from props
  const navigate = useNavigate();
  const {
    searchTerm,
    searchResults,
    loading: searchLoading,
    error: searchError,
    handleSearchChange,
    clearSearch,
  }
    = useStockSearch();

  const handleSelectStock = (symbol: string) => {
    navigate(`/stock/${symbol}`);
    clearSearch();
  };

  return (
    <>
      <Header
        title="MSignalAI"
        slogan="AI Interpreting Momentum, Cycles, and Risks"
      // Removed setShowAIDialog from Header props
      >
        <SearchBar
          searchTerm={searchTerm}
          searchResults={searchResults}
          onSearchChange={handleSearchChange}
          onSelectStock={handleSelectStock}
          loading={searchLoading}
        />
      </Header>
      <div className={appStyles['content-container']}>
        {searchError && <ErrorDisplay message={searchError} />}
        <Outlet /> {/* This is where child routes will be rendered */}
      </div>
    </>
  );
};

export default Layout;
