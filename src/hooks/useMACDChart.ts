// frontend/src/hooks/useMACDChart.ts
import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { StockData, MACDMarker, MACDHistogramItem } from '../types'; // Import MACDMarker and MACDHistogramItem
import { fetchMACDData } from '../services/api';

interface UseMACDChartProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedSymbol: string;
  interval: string;
  showMACD: boolean;
}

export const useMACDChart = ({ containerRef, selectedSymbol, interval, showMACD }: UseMACDChartProps) => {
  const macdChartRef = useRef<IChartApi | null>(null);
  const macdLineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const signalLineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const macdHistogramSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  useEffect(() => {
    if (!showMACD || !containerRef.current) {
      return;
    }

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: '#ffffff' }, textColor: '#333' },
      grid: { vertLines: { color: '#f0f0f0' }, horzLines: { color: '#f0f0f0' } },
      timeScale: { timeVisible: true, secondsVisible: false },
    });
    macdChartRef.current = chart;
    macdLineSeriesRef.current = chart.addLineSeries({ color: 'blue', lineWidth: 1 });
    signalLineSeriesRef.current = chart.addLineSeries({ color: 'orange', lineWidth: 1 });
    macdHistogramSeriesRef.current = chart.addHistogramSeries({});

    fetchMACDData(selectedSymbol, interval).then(data => {
      if (data.status === "insufficient_data") {
        // Display message to user (e.g., via a state setter passed as prop or context)
        // For now, we'll just log and ensure no data is set
        console.warn("MACD Data Warning:", data.message);
        macdLineSeriesRef.current?.setData([]);
        signalLineSeriesRef.current?.setData([]);
        macdHistogramSeriesRef.current?.setData([]);
        macdLineSeriesRef.current?.setMarkers([]);
        return;
      }

      // Data is now processed by the backend
      const macdLineData = data.macd_line.map((value, index) => ({ time: new Date(data.timestamps[index]).getTime() / 1000 as Time, value: value !== null ? value : undefined })).filter(item => item.value !== undefined);
      const signalLineData = data.signal_line.map((value, index) => ({ time: new Date(data.timestamps[index]).getTime() / 1000 as Time, value: value !== null ? value : undefined })).filter(item => item.value !== undefined);
      const histogramData = data.histogram_data.map((item: MACDHistogramItem) => ({ time: new Date(item.time).getTime() / 1000 as Time, value: item.value !== null ? item.value : undefined, color: item.color })).filter(item => item.value !== undefined);
      
      macdLineSeriesRef.current?.setData(macdLineData);
      signalLineSeriesRef.current?.setData(signalLineData);
      macdHistogramSeriesRef.current?.setData(histogramData);

      // Markers are now processed by the backend
      const allMarkers = [...data.crossover_markers, ...data.divergence_markers].map((marker: MACDMarker) => ({
        ...marker,
        time: new Date(marker.time).getTime() / 1000 as Time,
      })).sort((a, b) => (a.time as number) - (b.time as number));

      macdLineSeriesRef.current?.setMarkers(allMarkers);
    });

    const handleResize = () => chart.resize(containerRef.current!.clientWidth, 400);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      macdChartRef.current = null;
      macdLineSeriesRef.current = null;
      signalLineSeriesRef.current = null;
      macdHistogramSeriesRef.current = null;
    };
  }, [showMACD, selectedSymbol, interval]); // Dependencies for MACD chart and series

  return macdChartRef;
};