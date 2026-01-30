// frontend/src/components/SparklineChart.tsx
import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData, ColorType } from 'lightweight-charts';

interface SparklineChartProps {
  data: { date: string; value: number }[];
  title: string;
  color?: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ data, title, color = '#2962FF' }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up existing chart if it exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 240, // Increased height further
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#D1D4DC',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: true, color: '#242424ff', style: 2 }, // Light horizontal lines
      },
      timeScale: {
        visible: true, // Make time scale visible
        borderVisible: true,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }); // Shortened format
        },
      },
      rightPriceScale: {
        visible: true, // Make price scale visible
        borderVisible: true, // Make border visible to show labels
      },
      crosshair: {
        mode: 0, // Hide crosshair
      },
      localization: {
        locale: 'en-US',
      },
    });

    chartRef.current = chart;

    // Apply options to the right price scale
    chart.priceScale('right').applyOptions({
      visible: true, // Ensure the price scale is visible
      borderVisible: true, // Keep the border visible for labels
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    });

    const newSeries = chart.addLineSeries({
      color: color,
      lineWidth: 2,
      lastValueVisible: false, // No need for last value in sparkline
      priceLineVisible: false, // No need for price line in sparkline
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });
    seriesRef.current = newSeries;

    const formattedData: LineData[] = data.map(item => ({
      time: new Date(item.date).getTime() / 1000 as LineData['time'], // Convert date string to Unix timestamp
      value: item.value,
    }));

    newSeries.setData(formattedData);

    // Adjust time scale to fit all data
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        if (seriesRef.current) { // Explicitly remove series first
          chartRef.current.removeSeries(seriesRef.current);
          seriesRef.current = null;
        }
        chartRef.current.remove(); // Then remove the chart
        chartRef.current = null;
      }
    };
  }, [data, color]);

  return (
    <div style={{ marginBottom: '10px' }}>
      <h4>{title}</h4>
      <div ref={chartContainerRef} style={{ width: '100%', height: '240px' }} />
    </div>
  );
};

export default SparklineChart;
