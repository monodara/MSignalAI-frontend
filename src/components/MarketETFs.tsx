// frontend/src/components/MarketETFs.tsx
import React from 'react';
import { MarketETF } from '../types';
import styles from './MarketETFs.module.css'; // Import as CSS module

interface MarketETFsProps {
  marketETFs: MarketETF[];
  loading: boolean;
}

const MarketETFs: React.FC<MarketETFsProps> = ({ marketETFs, loading }) => {
  if (loading) {
    return <p>Loading market data...</p>;
  }

  return (
    <section className={styles['market-index-container']}>
      <h2 className={styles['market-index-title']}>Market Indexes</h2>
      <div className={styles['market-index-list']}>
        {marketETFs.map((etf) => (
          <div key={etf.symbol} className={styles['market-index-card']}>
            {/* <span className={styles['market-index-symbol']}>{etf.symbol}</span> */}
            <span className={styles['market-index-name']}>{etf.name.split('E')[0]}</span>
            {etf.close && <span className={styles['market-index-value']}>{etf.close}</span>}
            {etf.error && <span className="error-message">{etf.error}</span>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketETFs;