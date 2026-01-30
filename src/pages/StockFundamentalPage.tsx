// frontend/src/pages/StockFundamentalPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFundamentalData } from '../services/api';
import { FundamentalData, CalculatedMetrics, FundamentalState, MetricItem } from '../types';
import ErrorDisplay from '../components/ErrorDisplay';
import SparklineChart from '../components/SparklineChart'; // New import
import styles from './StockFundamentalPage.module.css'; // Import as CSS module
import errorDisplayStyles from '../components/ErrorDisplay.module.css'; // Import error display styles
import appStyles from '../App.module.css'; // Import App.module.css for global styles

const StockFundamentalPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [fundamentalData, setFundamentalData] = useState<FundamentalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFundamentalData = async () => {
      if (!symbol) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFundamentalData(symbol);
        setFundamentalData(data);
      } catch (err) {
        console.error('Error fetching fundamental data:', err);
        setError('Failed to fetch fundamental data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getFundamentalData();
  }, [symbol]);

  if (!symbol) {
    return <div className={appStyles.App}><h2>No stock symbol provided.</h2></div>;
  }

  // Helper function to render a single MetricItem
  const renderMetricItem = (item: MetricItem) => {
    return (
      <p key={item.name}>
        <strong>{item.name}:</strong> {item.value}
        {item.trend && <span className={styles['metric-trend']}>{' '}{item.trend}</span>}
        {item.status && item.color && (
          <span className={styles['metric-status']} style={{ color: item.color }}>
            {' '}●
          </span>
        )}
      </p>
    );
  };

  // Helper function to render calculated metrics
  const renderCalculatedMetrics = (metrics: CalculatedMetrics) => {
    return (
      <div className={styles['metrics-container']}>
        <h3>Calculated Metrics</h3>

        <h4>Profitability</h4>
        {metrics.grossProfitMargin && renderMetricItem(metrics.grossProfitMargin)}
        {metrics.operatingProfitMargin && renderMetricItem(metrics.operatingProfitMargin)}
        {metrics.netProfitMargin && renderMetricItem(metrics.netProfitMargin)}

        <h4>Growth</h4>
        {metrics.revenueGrowthYoY && renderMetricItem(metrics.revenueGrowthYoY)}
        {metrics.epsGrowthYoY && renderMetricItem(metrics.epsGrowthYoY)}

        <h4>Cash Flow</h4>
        {metrics.latestFcf && renderMetricItem(metrics.latestFcf)}
        {metrics.fcfTrend && renderMetricItem(metrics.fcfTrend)}

        <h4>Financial Health</h4>
        {metrics.debtToEquity && renderMetricItem(metrics.debtToEquity)}
        {metrics.currentRatio && renderMetricItem(metrics.currentRatio)}
      </div>
    );
  };

  // Helper function to render fundamental state
  const renderFundamentalState = (state: FundamentalState) => {
    return (
      <div className={styles['fundamental-state-container']}>
        <h3>Fundamental State</h3>
        <p><strong>Profitability:</strong> <span className={styles[`state-${state.profitability.status}`]}>{state.profitability.status}</span></p>
        <p><strong>Growth:</strong> <span className={styles[`state-${state.growth.status}`]}>{state.growth.status}</span></p>
        <p><strong>Cashflow:</strong> <span className={styles[`state-${state.cashflow.status}`]}>{state.cashflow.status}</span></p>
        <p><strong>Balance Sheet:</strong> <span className={styles[`state-${state.balanceSheet.status}`]}>{state.balanceSheet.status}</span></p>
        <p><strong>Valuation Context:</strong> <span className={styles[`state-${state.valuationContext.status}`]}>{state.valuationContext.status}</span></p>
      </div>
    );
  };

  return (
    <div className={appStyles.App}>
      <h2>Fundamental Data for {symbol}</h2>
      {loading && <p className={errorDisplayStyles['loading-message']}>Loading fundamental data...</p>}
      {error && <ErrorDisplay message={error} />}

      {fundamentalData && !loading && !error && (
        <div className={styles['fundamental-data-content']}>
          <p>Last Updated: {new Date(fundamentalData.last_updated).toLocaleString()}</p>

          {renderFundamentalState(fundamentalData.fundamentalState)}
          {renderCalculatedMetrics(fundamentalData.calculatedMetrics)}

          <div className={styles['sparkline-section']}>
            <h3>Historical Trends (Last 4-8 Quarters)</h3>
            {fundamentalData.historicalRevenue && fundamentalData.historicalRevenue.length > 0 && (
              <SparklineChart title="Revenue" data={fundamentalData.historicalRevenue} color="#4CAF50" />
            )}
            {fundamentalData.historicalEPS && fundamentalData.historicalEPS.length > 0 && (
              <SparklineChart title="EPS" data={fundamentalData.historicalEPS} color="#2196F3" />
            )}
            {fundamentalData.historicalFreeCashFlow && fundamentalData.historicalFreeCashFlow.length > 0 && (
              <SparklineChart title="Free Cash Flow" data={fundamentalData.historicalFreeCashFlow} color="#FF9800" />
            )}
          </div>
        </div>
      )}

      {!fundamentalData && !loading && !error && (
        <p className={errorDisplayStyles['loading-message']}>No fundamental data available for {symbol}.</p>
      )}
    </div>
  );
};

export default StockFundamentalPage;