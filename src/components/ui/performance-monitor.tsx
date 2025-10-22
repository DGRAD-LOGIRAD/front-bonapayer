import { useEffect, useRef } from 'react';

interface PerformanceMonitorProps {
  componentName: string;
  onLoadTime?: (loadTime: number) => void;
}

export function PerformanceMonitor({
  componentName,
  onLoadTime,
}: PerformanceMonitorProps) {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const loadTime = Date.now() - startTime.current;

    if (onLoadTime) {
      onLoadTime(loadTime);
    }
  }, [componentName, onLoadTime]);

  return null;
}
