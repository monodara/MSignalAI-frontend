// frontend/src/hooks/useBollingerBandsChart.ts
import { useEffect, useRef } from 'react';
import { IChartApi, ISeriesApi, CandlestickSeriesPartialOptions, LineData, HistogramData, SeriesMarker, Time } from 'lightweight-charts';
import { BollingerBandData, BollingerBandMarker } from '../types';

interface BollingerBandChartProps {
  chart: IChartApi | null;
  candlestickSeries: ISeriesApi<'Candlestick'> | null;
  bollingerBandData: BollingerBandData | null;
  mainSeries: ISeriesApi<'Candlestick'> | null;
}

export const useBollingerBandsChart = ({ chart, candlestickSeries, bollingerBandData, mainSeries }: BollingerBandChartProps) => {
  const upperBandSeries = useRef<ISeriesApi<'Line'> | null>(null);
  const middleBandSeries = useRef<ISeriesApi<'Line'> | null>(null);
  const lowerBandSeries = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    // If chart or candlestickSeries is not ready, or bollingerBandData is null,
    // we should ensure series are removed and references cleared.
    // This block handles the case where BB data is toggled off or not available.
    if (!chart || !candlestickSeries || !bollingerBandData) {
      // The main chart's cleanup (in useMainChart) will call chart.remove(),
      // which automatically removes all series from the chart.
      // Therefore, individual series removal here is redundant and problematic
      // if the chart has already been destroyed.
      // We only need to clear our local references.
      upperBandSeries.current = null;
      middleBandSeries.current = null;
      lowerBandSeries.current = null;
      if (mainSeries) {
        mainSeries.setMarkers([]); // Clear markers from the main series
      }
      return;
    }

    // Remove old series if they exist before adding new ones.
    // This is important for re-rendering with new data/options.
    if (upperBandSeries.current) {
      chart.removeSeries(upperBandSeries.current);
      upperBandSeries.current = null;
    }
    if (middleBandSeries.current) {
      chart.removeSeries(middleBandSeries.current);
      middleBandSeries.current = null;
    }
    if (lowerBandSeries.current) {
      chart.removeSeries(lowerBandSeries.current);
      lowerBandSeries.current = null;
    }

    const newUpperBandSeries = chart.addLineSeries({ color: '#2962FF', lineWidth: 1, title: 'Upper BB' });
    const newMiddleBandSeries = chart.addLineSeries({ color: '#FF6D00', lineWidth: 1, title: 'Middle BB' });
    const newLowerBandSeries = chart.addLineSeries({ color: '#2962FF', lineWidth: 1, title: 'Lower BB' });

    upperBandSeries.current = newUpperBandSeries;
    middleBandSeries.current = newMiddleBandSeries;
    lowerBandSeries.current = newLowerBandSeries;

    const upperData: LineData[] = bollingerBandData.timestamps.map((time, index) => ({
      time: time as Time,
      value: bollingerBandData.upper[index] || 0,
    }));
    const middleData: LineData[] = bollingerBandData.timestamps.map((time, index) => ({
      time: time as Time,
      value: bollingerBandData.middle[index] || 0,
    }));
    const lowerData: LineData[] = bollingerBandData.timestamps.map((time, index) => ({
      time: time as Time,
      value: bollingerBandData.lower[index] || 0,
    }));

    newUpperBandSeries.setData(upperData);
    newMiddleBandSeries.setData(middleData);
    newLowerBandSeries.setData(lowerData);

    // Add markers for Bollinger Band analysis
    const allMarkers: SeriesMarker<Time>[] = [];

    if (bollingerBandData.squeeze_markers) {
      const squeezeMarkers: SeriesMarker<Time>[] = bollingerBandData.squeeze_markers.map(marker => ({
        time: marker.time as Time,
        position: 'belowBar', // Position below the bar
        color: '#FFD700', // Gold
        shape: 'circle',
        text: 'Squeeze',
        size: 1,
      }));
      allMarkers.push(...squeezeMarkers);
    }

    if (bollingerBandData.walking_the_bands_markers) {
      const walkingMarkers: SeriesMarker<Time>[] = bollingerBandData.walking_the_bands_markers.map(marker => ({
        time: marker.time as Time,
        position: marker.position === 'aboveBar' ? 'aboveBar' : 'belowBar',
        color: marker.color,
        shape: marker.shape === 'arrowUp' ? 'arrowUp' : 'arrowDown',
        text: marker.text,
        size: 1,
      }));
      allMarkers.push(...walkingMarkers);
    }

    if (bollingerBandData.false_breakout_markers) {
      const falseBreakoutMarkers: SeriesMarker<Time>[] = bollingerBandData.false_breakout_markers.map(marker => ({
        time: marker.time as Time,
        position: marker.position === 'aboveBar' ? 'aboveBar' : 'belowBar',
        color: marker.color,
        shape: 'square',
        text: marker.text,
        size: 1,
      }));
      allMarkers.push(...falseBreakoutMarkers);
    }

    if (bollingerBandData.middle_band_support_resistance_markers) {
      const middleBandMarkers: SeriesMarker<Time>[] = bollingerBandData.middle_band_support_resistance_markers.map(marker => ({
        time: marker.time as Time,
        position: marker.position === 'aboveBar' ? 'aboveBar' : 'belowBar',
        color: marker.color,
        shape: 'circle',
        text: marker.text,
        size: 1,
      }));
      allMarkers.push(...middleBandMarkers);
    }

    if (bollingerBandData.extreme_deviation_markers) {
      const extremeDeviationMarkers: SeriesMarker<Time>[] = bollingerBandData.extreme_deviation_markers.map(marker => ({
        time: marker.time as Time,
        position: marker.position === 'aboveBar' ? 'aboveBar' : 'belowBar',
        color: marker.color,
        shape: marker.shape === 'triangleUp' ? 'arrowUp' : 'arrowDown',
        text: marker.text,
        size: 1,
      }));
      allMarkers.push(...extremeDeviationMarkers);
    }

    if (mainSeries) {
      // Convert time to Unix timestamp for consistent sorting
      const sortedMarkers = allMarkers.map(marker => ({
        ...marker,
        time: new Date(marker.time as string).getTime() / 1000 as Time,
      })).sort((a, b) => (a.time as number) - (b.time as number));
      mainSeries.setMarkers(sortedMarkers);
    }

    return () => {
      // The main chart's cleanup (in useMainChart) will call chart.remove(),
      // which automatically removes all series from the chart.
      // Therefore, individual series removal here is redundant and problematic
      // if the chart has already been destroyed.
      // We only need to clear our local references.
      upperBandSeries.current = null;
      middleBandSeries.current = null;
      lowerBandSeries.current = null;
      if (mainSeries) {
        mainSeries.setMarkers([]); // Clear markers from the main series during cleanup
      }
    };
  }, [chart, candlestickSeries, bollingerBandData, mainSeries]);

  return { upperBandSeries, middleBandSeries, lowerBandSeries };
};
