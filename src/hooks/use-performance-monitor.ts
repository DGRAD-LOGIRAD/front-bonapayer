import { useRef } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(Date.now());

  const endMeasurement = () => {
    const loadTime = Date.now() - startTime.current;

    return loadTime;
  };

  return { endMeasurement };
};
