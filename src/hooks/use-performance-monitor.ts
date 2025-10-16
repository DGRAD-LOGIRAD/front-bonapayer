import { useRef } from 'react';

// Hook pour mesurer les performances des composants
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(Date.now());

  const endMeasurement = () => {
    const loadTime = Date.now() - startTime.current;

    if (import.meta.env.DEV) {
      console.log(`⚡ ${componentName} rendered in ${loadTime}ms`);
    }

    return loadTime;
  };

  return { endMeasurement };
};
