// frontend/src/pages/MyListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyStockList, removeStockFromMyList } from '../utils/localStorage';
import styles from './MyListPage.module.css'; // Import as CSS module
import headerStyles from '../components/Header.module.css'; // Import header styles for buttons
import appStyles from '../App.module.css'; // Import App.module.css for global styles

const MyListPage: React.FC = () => {
  const [myStocks, setMyStocks] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setMyStocks(getMyStockList());
  }, []);

  const handleRemoveStock = (symbol: string) => {
    removeStockFromMyList(symbol);
    alert(`${symbol} removed from your list.`);
    setMyStocks(getMyStockList()); // Refresh the list
  };

  const handleViewStock = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className={appStyles.App}>
      <h2 className={styles['my-list-title']}>My Watchlist</h2>
      <div className={styles['my-list-container']}>
        {myStocks.length === 0 ? (
          <p>Your watchlist is empty. Add some stocks from their chart pages!</p>
        ) : (
          <ul className={styles['stock-list']}>
            {myStocks.map(symbol => (
              <li key={symbol} className={styles['stock-list-item']}>
                <span>{symbol}</span>
                <div className={styles.actions}>
                  <button onClick={() => handleViewStock(symbol)} className={headerStyles['view-button']}>View Chart</button>
                  <button onClick={() => handleRemoveStock(symbol)} className={headerStyles['remove-button']}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
