// frontend/src/pages/StockChartPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStockData } from '../services/api';
import { StockData } from '../types';
import StockChart from '../components/StockChart'; // Import the StockChart component
import { getMyStockList, addStockToMyList, removeStockFromMyList } from '../utils/localStorage';
import headerStyles from '../components/Header.module.css'; // Import header styles for buttons
import appStyles from '../App.module.css'; // Import App.module.css for global styles

const StockChartPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate(); // Initialize useNavigate
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [interval, setInterval] = useState<string>('1day'); // Default interval for this page
  const [isStockInList, setIsStockInList] = useState<boolean>(false);

  // Fetch Stock Data for Chart
  const getStockData = useCallback(async (selectedSymbol: string, selectedInterval: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStockData(selectedSymbol, selectedInterval);
      setStockData(data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to fetch stock data. Please try again.');
      setStockData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch for the stock from URL params
  useEffect(() => {
    if (symbol) {
      getStockData(symbol, interval);
      setIsStockInList(getMyStockList().includes(symbol));
    }
  }, [symbol, interval, getStockData]);

  const handleToggleMyList = () => {
    if (!symbol) return;

    if (isStockInList) {
      removeStockFromMyList(symbol);
      alert(`${symbol} removed from your list.`);
    } else {
      addStockToMyList(symbol);
      alert(`${symbol} added to your list!`);
    }
    setIsStockInList(!isStockInList);
  };

  const handleViewNews = () => {
    if (symbol) {
      navigate(`/stock/${symbol}/news`);
    }
  };

  if (!symbol) {
    return <div className={appStyles.App}><h2>No stock symbol provided.</h2></div>;
  }

  return (
    <div className={appStyles.App}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2>Stock Chart: {symbol}</h2>
        <div>
          <button onClick={handleToggleMyList} className={headerStyles['add-to-list-button']}>
            {isStockInList ? 'Remove from My List' : 'Add to My List'}
          </button>
          <button onClick={handleViewNews} className={headerStyles['view-button']} style={{ marginLeft: '10px' }}>
            View News
          </button>
          <button onClick={() => navigate(`/stock/${symbol}/fundamental`)} className={headerStyles['view-button']} style={{ marginLeft: '10px' }}>
            View Fundamentals
          </button>
          <button onClick={() => navigate(`/stock/${symbol}/analysis`)} className={headerStyles['view-button']} style={{ marginLeft: '10px' }}>
            Analyze with AI
          </button>
        </div>
      </div>
      <StockChart
        selectedSymbol={symbol}
        stockData={stockData}
        loading={loading}
        error={error}
        interval={interval}
        setInterval={setInterval}
      />
    </div>
  );
};

export default StockChartPage;
