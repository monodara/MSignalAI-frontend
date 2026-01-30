import React, { useEffect, useRef, useState } from 'react';
import { StockData, RSIData, BollingerBandData } from '../types';
import { fetchRSIData, fetchBollingerBandData } from '../services/api';
import { useMACDChart } from '../hooks/useMACDChart';
import { useRSIChart } from '../hooks/useRSIChart';
import { useBollingerBandsChart } from '../hooks/useBollingerBandsChart';
import { useMainChart } from '../hooks/useMainChart';
import { useChartSynchronization } from '../hooks/useChartSynchronization';
import { useBandwidthChart } from '../hooks/useBandwidthChart';
import styles from './StockChart.module.css'; // Import as CSS module
import headerStyles from './Header.module.css'; // Import header styles for buttons

interface StockChartProps {
  selectedSymbol: string;
  stockData: StockData | null;
  loading: boolean;
  error: string | null;
  interval: string;
  setInterval: (interval: string) => void;
}

const StockChart: React.FC<StockChartProps> = ({
  selectedSymbol,
  stockData,
  loading,
  error,
  interval,
  setInterval,
}) => {
  const mainChartContainerRef = useRef<HTMLDivElement>(null);
  const rsiChartContainerRef = useRef<HTMLDivElement>(null);
  const macdChartContainerRef = useRef<HTMLDivElement>(null);
  const bandwidthChartContainerRef = useRef<HTMLDivElement>(null);

  const [showMACD, setShowMACD] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [showBB, setShowBB] = useState(false);
  const [showBandwidth, setShowBandwidth] = useState(false);
  const [rsiData, setRsiData] = useState<RSIData | null>(null);
  const [bollingerBandData, setBollingerBandData] = useState<BollingerBandData | null>(null);
  const [bollingerLoading, setBollingerLoading] = useState<boolean>(false);
  const [bollingerError, setBollingerError] = useState<string | null>(null);

  useEffect(() => {
    if (showRSI && selectedSymbol && interval) {
      fetchRSIData(selectedSymbol, interval)
        .then(data => {
          if (data.status === 'success') {
            setRsiData(data);
          }
          else {
            console.error('Failed to fetch RSI data:', data.message);
            setRsiData(null);
          }
        })
        .catch(err => {
          console.error('Error fetching RSI data:', err);
          setRsiData(null);
        });
    }
    else {
      setRsiData(null);
    }
  }, [showRSI, selectedSymbol, interval]);

  useEffect(() => {
    if (showBB && selectedSymbol && interval) {
      setBollingerLoading(true);
      setBollingerError(null);
      fetchBollingerBandData(selectedSymbol, interval)
        .then(data => {
          if (data.status === 'success') {
            setBollingerBandData(data);
          }
          else {
            console.error('Failed to fetch Bollinger Band data:', data.message);
            setBollingerBandData(null);
            setBollingerError(data.message || 'Failed to fetch Bollinger Band data.');
          }
        })
        .catch(err => {
          console.error('Error fetching Bollinger Band data:', err);
          setBollingerBandData(null);
          setBollingerError('Failed to fetch Bollinger Band data. Please try again.');
        })
        .finally(() => {
          setBollingerLoading(false);
        });
    }
    else {
      setBollingerBandData(null);
    }
  }, [showBB, selectedSymbol, interval]);

  const { mainChartRef, candlestickSeriesRef } = useMainChart({
    containerRef: mainChartContainerRef,
    stockData,
    divergences: rsiData?.divergences,
  });

  const macdChartRef = useMACDChart({
    containerRef: macdChartContainerRef,
    selectedSymbol,
    interval,
    showMACD,
  });

  const rsiChartRef = useRSIChart({
    containerRef: rsiChartContainerRef,
    rsiData,
    showRSI,
  });

  useBollingerBandsChart({
    chart: mainChartRef.current,
    candlestickSeries: candlestickSeriesRef.current,
    bollingerBandData: bollingerBandData,
    mainSeries: candlestickSeriesRef.current, // Pass candlestickSeriesRef.current as mainSeries
  });

  const bandwidthChartRef = useBandwidthChart({
    containerRef: bandwidthChartContainerRef,
    bandwidthData: bollingerBandData?.bandwidth_data || null,
    showBandwidth,
  });

  useChartSynchronization({
    masterChartRef: mainChartRef,
    slaveChartRefs: [rsiChartRef, macdChartRef, bandwidthChartRef],
  });

  return (
    <section className={styles['chart-container']}>
      {/* <h2 className={styles['chart-title']}>Stock Chart: {selectedSymbol}</h2> */}
      <div className={styles['time-interval-buttons']}>
        {['1min', '5min', '15min', '30min', '1day', '1week', '1month'].map(btnInterval => (
          <button key={btnInterval} className={`${headerStyles['time-interval-button']} ${interval === btnInterval ? headerStyles.active : ''}`} onClick={() => setInterval(btnInterval)}>
            {btnInterval}
          </button>
        ))}
        <button className={`${headerStyles['time-interval-button']} ${showBB ? headerStyles.active : ''}`} onClick={() => setShowBB(!showBB)}>Bollinger Band</button>
        <button className={`${headerStyles['time-interval-button']} ${showBandwidth ? headerStyles.active : ''}`} onClick={() => setShowBandwidth(!showBandwidth)}>Bandwidth</button>
      </div>

      {loading && <p className="loading-message">Loading stock data...</p>}
      {error && <p className="error-message">{error}</p>}
      {bollingerLoading && <p className="loading-message">Loading Bollinger Band data...</p>}
      {bollingerError && <p className="error-message">{bollingerError}</p>}

      <div ref={mainChartContainerRef} style={{ width: '100%' }} />
      {showBandwidth && <div ref={bandwidthChartContainerRef} style={{ width: '100%', height: '150px', marginTop: '20px' }} />}

      <div className={styles['time-interval-buttons']} style={{ marginTop: '20px' }}>
        <button className={`${headerStyles['time-interval-button']} ${showMACD ? headerStyles.active : ''}`} onClick={() => setShowMACD(!showMACD)}>MACD</button>
        <button className={`${headerStyles['time-interval-button']} ${showRSI ? headerStyles.active : ''}`} onClick={() => setShowRSI(!showRSI)}>RSI</button>
      </div>

      {showMACD && <div ref={macdChartContainerRef} style={{ width: '100%', marginTop: '20px' }} />}
      {showRSI && <div ref={rsiChartContainerRef} style={{ width: '100%', marginTop: '20px' }} />}

      {!loading && !error && (!stockData || stockData.values.length === 0) && (
        <p className="loading-message">No stock data available for {selectedSymbol}.</p>
      )}
    </section>
  );
};

export default StockChart;