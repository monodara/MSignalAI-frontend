import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, Time, PriceScaleMode, LineData } from 'lightweight-charts';
import { RSIData } from '../types';

interface UseRSIChartProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  rsiData: RSIData | null;
  showRSI: boolean;
}

export const useRSIChart = ({ containerRef, rsiData, showRSI }: UseRSIChartProps) => {
  const rsiChartRef = useRef<IChartApi | null>(null);
  const rsiSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const rsiUpperLevelRef = useRef<ISeriesApi<'Line'> | null>(null);
  const rsiMiddleLevelRef = useRef<ISeriesApi<'Line'> | null>(null);
  const rsiLowerLevelRef = useRef<ISeriesApi<'Line'> | null>(null);
  const invisibleMinSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const invisibleMaxSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const overboughtAreaRef = useRef<ISeriesApi<'Area'> | null>(null);
  const overboughtMaskRef = useRef<ISeriesApi<'Area'> | null>(null);
  const oversoldAreaRef = useRef<ISeriesApi<'Area'> | null>(null);
  // Refs for divergence lines
  const bullishDivergenceSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const bearishDivergenceSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!showRSI || !containerRef.current) {
      // Cleanup existing chart if it exists
      if (rsiChartRef.current) {
        rsiChartRef.current.remove();
        rsiChartRef.current = null;
      }
      return;
    }

    // Initialize chart
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 150,
      layout: { background: { color: '#ffffff' }, textColor: '#333' },
      grid: { vertLines: { color: '#f0f0f0' }, horzLines: { color: '#f0f0f0' } },
      timeScale: { timeVisible: true, secondsVisible: false },
      rightPriceScale: { visible: true, autoScale: true, mode: PriceScaleMode.Normal },
    });
    rsiChartRef.current = chart;

    // Add all series
    invisibleMinSeriesRef.current = chart.addLineSeries({ visible: false, priceScaleId: 'right' });
    invisibleMaxSeriesRef.current = chart.addLineSeries({ visible: false, priceScaleId: 'right' });
    overboughtAreaRef.current = chart.addAreaSeries({ topColor: 'rgba(255, 0, 0, 0.1)', bottomColor: 'rgba(255, 0, 0, 0.1)', lineColor: 'transparent', lineVisible: false, priceScaleId: 'right' });
    overboughtMaskRef.current = chart.addAreaSeries({ topColor: '#ffffff', bottomColor: '#ffffff', lineColor: 'transparent', lineVisible: false, priceScaleId: 'right' });
    oversoldAreaRef.current = chart.addAreaSeries({ topColor: 'rgba(0, 255, 0, 0.1)', bottomColor: 'rgba(0, 255, 0, 0.1)', lineColor: 'transparent', lineVisible: false, priceScaleId: 'right' });
    rsiUpperLevelRef.current = chart.addLineSeries({ color: 'red', lineWidth: 1, lineStyle: 2, lastValueVisible: false, priceLineVisible: false, priceScaleId: 'right' });
    rsiMiddleLevelRef.current = chart.addLineSeries({ color: 'gray', lineWidth: 1, lineStyle: 2, lastValueVisible: false, priceLineVisible: false, priceScaleId: 'right' });
    rsiLowerLevelRef.current = chart.addLineSeries({ color: 'green', lineWidth: 1, lineStyle: 2, lastValueVisible: false, priceLineVisible: false, priceScaleId: 'right' });
    rsiSeriesRef.current = chart.addLineSeries({ color: 'purple', lineWidth: 1, priceScaleId: 'right' });
    
    // Divergence Series
    bullishDivergenceSeriesRef.current = chart.addLineSeries({ color: '#26a69a', lineWidth: 2, lineStyle: 2 }); // Dashed green
    bearishDivergenceSeriesRef.current = chart.addLineSeries({ color: '#ef5350', lineWidth: 2, lineStyle: 2 }); // Dashed red

    const handleResize = () => chart.resize(containerRef.current!.clientWidth, 150);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      rsiChartRef.current = null;
    };
  }, [showRSI, containerRef]); // Only re-create the chart when showRSI changes

  useEffect(() => {
    if (!rsiChartRef.current || !showRSI) return;

    if (rsiData && rsiData.status === 'success') {
      const processedRsiData = rsiData.rsi.map((value, index) => {
        const time = (new Date(rsiData.timestamps[index]).getTime() / 1000) as Time;
        return value !== null ? { time, value } : null;
      }).filter((item): item is LineData<Time> => item !== null);
      
      processedRsiData.sort((a, b) => (a.time as number) - (b.time as number));
      rsiSeriesRef.current?.setData(processedRsiData);

      const firstTime = processedRsiData.length > 0 ? processedRsiData[0].time : undefined;
      const lastTime = processedRsiData.length > 0 ? processedRsiData[processedRsiData.length - 1].time : undefined;

      if (firstTime && lastTime) {
        rsiUpperLevelRef.current?.setData([{ time: firstTime, value: 70 }, { time: lastTime, value: 70 }]);
        rsiMiddleLevelRef.current?.setData([{ time: firstTime, value: 50 }, { time: lastTime, value: 50 }]);
        rsiLowerLevelRef.current?.setData([{ time: firstTime, value: 30 }, { time: lastTime, value: 30 }]);
        invisibleMinSeriesRef.current?.setData([{ time: firstTime, value: 0 }, { time: lastTime, value: 0 }]);
        invisibleMaxSeriesRef.current?.setData([{ time: firstTime, value: 100 }, { time: lastTime, value: 100 }]);
        overboughtAreaRef.current?.setData([{ time: firstTime, value: 100 }, { time: lastTime, value: 100 }]);
        overboughtMaskRef.current?.setData([{ time: firstTime, value: 70 }, { time: lastTime, value: 70 }]);
        oversoldAreaRef.current?.setData([{ time: firstTime, value: 30 }, { time: lastTime, value: 30 }]);

        // Process and set divergence data
        const bullishDivergenceData = rsiData.divergences.bullish.flatMap(div => [
          { time: (new Date(div.rsi_start.time).getTime() / 1000) as Time, value: div.rsi_start.value },
          { time: (new Date(div.rsi_end.time).getTime() / 1000) as Time, value: div.rsi_end.value }
        ]);
        bullishDivergenceData.sort((a, b) => (a.time as number) - (b.time as number));
        const uniqueBullishData = bullishDivergenceData.filter((item, index, self) =>
          index === 0 || item.time !== self[index - 1].time
        );

        const bearishDivergenceData = rsiData.divergences.bearish.flatMap(div => [
            { time: (new Date(div.rsi_start.time).getTime() / 1000) as Time, value: div.rsi_start.value },
            { time: (new Date(div.rsi_end.time).getTime() / 1000) as Time, value: div.rsi_end.value }
        ]);
        bearishDivergenceData.sort((a, b) => (a.time as number) - (b.time as number));
        const uniqueBearishData = bearishDivergenceData.filter((item, index, self) =>
          index === 0 || item.time !== self[index - 1].time
        );
        
        bullishDivergenceSeriesRef.current?.setData(uniqueBullishData);
        bearishDivergenceSeriesRef.current?.setData(uniqueBearishData);
      }
      rsiChartRef.current.timeScale().fitContent();
    } else {
      // Clear all series data if rsiData is null or status is not success
      rsiSeriesRef.current?.setData([]);
      rsiUpperLevelRef.current?.setData([]);
      rsiMiddleLevelRef.current?.setData([]);
      rsiLowerLevelRef.current?.setData([]);
      invisibleMinSeriesRef.current?.setData([]);
      invisibleMaxSeriesRef.current?.setData([]);
      overboughtAreaRef.current?.setData([]);
      overboughtMaskRef.current?.setData([]);
      oversoldAreaRef.current?.setData([]);
      bullishDivergenceSeriesRef.current?.setData([]);
      bearishDivergenceSeriesRef.current?.setData([]);
    }
  }, [rsiData, showRSI]); // Update data when rsiData or showRSI changes

  return rsiChartRef;
};