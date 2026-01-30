// frontend/src/hooks/useChartSynchronization.ts
import { useEffect, RefObject } from 'react';
import { IChartApi } from 'lightweight-charts';

interface UseChartSynchronizationProps {
  masterChartRef: RefObject<IChartApi | null>;
  slaveChartRefs: RefObject<IChartApi | null>[];
}

export const useChartSynchronization = ({ masterChartRef, slaveChartRefs }: UseChartSynchronizationProps) => {
  useEffect(() => {
    const master = masterChartRef.current;
    if (!master) return;

    const slaves = slaveChartRefs
      .map(ref => ref.current)
      .filter((chart): chart is IChartApi => chart !== null);

    const onVisibleTimeRangeChanged = (timeRange: any) => {
      slaves.forEach(slave => {
        slave.timeScale().setVisibleRange(timeRange);
      });
    };
    master.timeScale().subscribeVisibleTimeRangeChange(onVisibleTimeRangeChanged);

    const unsubscribers = slaves.map(slave => {
        const onSlaveVisibleTimeRangeChanged = (timeRange: any) => {
            master.timeScale().setVisibleRange(timeRange);
            slaves.forEach(otherSlave => {
                if (otherSlave !== slave) {
                    otherSlave.timeScale().setVisibleRange(timeRange);
                }
            });
        };
        slave.timeScale().subscribeVisibleTimeRangeChange(onSlaveVisibleTimeRangeChanged);
        return () => slave.timeScale().unsubscribeVisibleTimeRangeChange(onSlaveVisibleTimeRangeChanged);
    });

    return () => {
      master.timeScale().unsubscribeVisibleTimeRangeChange(onVisibleTimeRangeChanged);
      unsubscribers.forEach(unsub => unsub());
    };
  }, [masterChartRef, slaveChartRefs]);
};
