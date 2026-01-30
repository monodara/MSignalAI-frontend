// frontend/src/hooks/useBandwidthChart.ts
import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData, Time, ColorType } from 'lightweight-charts';
import { BandwidthData } from '../types';

interface BandwidthChartProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  bandwidthData: BandwidthData | null;
  showBandwidth: boolean;
}

export const useBandwidthChart = ({ containerRef, bandwidthData, showBandwidth }: BandwidthChartProps) => {
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!containerRef.current || !showBandwidth) {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      return;
    }

    if (!chartRef.current) {
      chartRef.current = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height: 150,
        layout: {
          background: { type: ColorType.Solid, color: '#1E222D' },
          textColor: '#D1D4DC',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          autoScale: true,
        },
      });
      seriesRef.current = chartRef.current.addLineSeries({ color: '#26a69a', title: 'Bandwidth' });
    }

    if (bandwidthData && seriesRef.current) {
      console.log("useBandwidthChart: Received bandwidthData", bandwidthData);
      const formattedData: LineData[] = bandwidthData.timestamps.map((time, index) => ({
        time: time as Time,
        value: bandwidthData.bandwidth[index] || 0,
      }));
      console.log("useBandwidthChart: Formatted data for series", formattedData);
      seriesRef.current.setData(formattedData);
    }

    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [bandwidthData, showBandwidth, containerRef]);

  return chartRef;
};
