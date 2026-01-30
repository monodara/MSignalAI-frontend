import React, { lazy, Suspense } from 'react'; // Removed useState
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.css'; // Import as CSS module

// Import Context
import { useMarketETFsContext } from './context/MarketETFsContext';

// Import Components
import Layout from './components/Layout'; // Import Layout
import MarketETFs from './components/MarketETFs';
import ErrorDisplay from './components/ErrorDisplay';
// Removed AIDialog import

// Lazy-loaded Pages
const StockChartPage = lazy(() => import('./pages/StockChartPage'));
const MyListPage = lazy(() => import('./pages/MyListPage'));
const StockNewsPage = lazy(() => import('./pages/StockNewsPage'));
const StockFundamentalPage = lazy(() => import('./pages/StockFundamentalPage'));
const StockAnalysisPage = lazy(() => import('./pages/StockAnalysisPage'));
const AIChatPage = lazy(() => import('./pages/AIChatPage')); // Import AIChatPage

function HomePage() {
  const { marketETFs, loading: etfsLoading, error: etfsError } = useMarketETFsContext();

  return (
    <>
      {etfsError && <ErrorDisplay message={etfsError} />}

      <MarketETFs marketETFs={marketETFs} loading={etfsLoading} />
    </>
  );
}

function App() {
  // Removed showAIDialog state

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Removed setShowAIDialog from Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="stock/:symbol" element={<StockChartPage />} />
            <Route path="stock/:symbol/news" element={<StockNewsPage />} />
            <Route path="stock/:symbol/fundamental" element={<StockFundamentalPage />} />
            <Route path="stock/:symbol/analysis" element={<StockAnalysisPage />} />
            <Route path="mylist" element={<MyListPage />} />
            <Route path="ai-chat" element={<AIChatPage />} /> {/* New route for AI Chat Page */}
          </Route>
        </Routes>
      </Suspense>
      {/* Removed AIDialog component */}
    </BrowserRouter>
  );
}

export default App;