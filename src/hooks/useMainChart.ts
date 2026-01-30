import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { StockData, Divergences } from '../types';

interface UseMainChartProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  stockData: StockData | null;
  divergences?: Divergences | null;
}

export const useMainChart = ({ containerRef, stockData, divergences }: UseMainChartProps) => {
  const mainChartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const bullishDivergenceSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const bearishDivergenceSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  // --- Main Chart Initialization ---
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: '#ffffff' }, textColor: '#333' },
      grid: { vertLines: { color: '#f0f0f0' }, horzLines: { color: '#f0f0f0' } },
      timeScale: { timeVisible: true, secondsVisible: false },
    });
    mainChartRef.current = chart;
    candlestickSeriesRef.current = chart.addCandlestickSeries({
      upColor: '#26a69a', downColor: '#ef5350', borderDownColor: '#ef5350',
      borderUpColor: '#26a69a', wickDownColor: '#ef5350', wickUpColor: '#26a69a',
    });

    // Add divergence series
    bullishDivergenceSeriesRef.current = chart.addLineSeries({ color: '#26a69a', lineWidth: 2, lineStyle: 2 });
    bearishDivergenceSeriesRef.current = chart.addLineSeries({ color: '#ef5350', lineWidth: 2, lineStyle: 2 });

    const handleResize = () => chart.resize(containerRef.current!.clientWidth, 400);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [containerRef]); // Added containerRef to dependencies

  // --- Data Loading for Main Series ---
  useEffect(() => {
    if (candlestickSeriesRef.current && stockData?.values) {
      const chartData = stockData.values.map(d => ({
        time: (new Date(d.datetime).getTime() / 1000) as Time,
        open: parseFloat(d.open), high: parseFloat(d.high),
        low: parseFloat(d.low), close: parseFloat(d.close),
      }));
      candlestickSeriesRef.current.setData(chartData);
      mainChartRef.current?.timeScale().fitContent();
    }
  }, [stockData]);

  // --- Data Loading for Divergences ---
  useEffect(() => {
    if (divergences) {
      const bullishData = divergences.bullish.flatMap(div => [
        { time: (new Date(div.price_start.time).getTime() / 1000) as Time, value: div.price_start.value },
        { time: (new Date(div.price_end.time).getTime() / 1000) as Time, value: div.price_end.value }
      ]);
      bullishData.sort((a, b) => (a.time as number) - (b.time as number));
      const uniqueBullishData = bullishData.filter((item, index, self) =>
        index === 0 || item.time !== self[index - 1].time
      );
      bullishDivergenceSeriesRef.current?.setData(uniqueBullishData);

      const bearishData = divergences.bearish.flatMap(div => [
        { time: (new Date(div.price_start.time).getTime() / 1000) as Time, value: div.price_start.value },
        { time: (new Date(div.price_end.time).getTime() / 1000) as Time, value: div.price_end.value }
      ]);
      bearishData.sort((a, b) => (a.time as number) - (b.time as number));
      const uniqueBearishData = bearishData.filter((item, index, self) =>
        index === 0 || item.time !== self[index - 1].time
      );
      bearishDivergenceSeriesRef.current?.setData(uniqueBearishData);
    } else {
      // Clear data if divergences are not present
      bullishDivergenceSeriesRef.current?.setData([]);
      bearishDivergenceSeriesRef.current?.setData([]);
    }
  }, [divergences]);

  return { mainChartRef, candlestickSeriesRef };
};