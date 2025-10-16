import { useEffect } from 'react';

interface PreloaderProps {
  routes?: string[];
}

export function Preloader({ routes = [] }: PreloaderProps) {
  useEffect(() => {
    const importantRoutes = [
      '/dashboard',
      '/dashboard/bon-a-payers',
      '/dashboard/bon-a-payers/creer',
      ...routes,
    ];

    const preloadRoute = (route: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    };

    const timeoutId = setTimeout(() => {
      importantRoutes.forEach(preloadRoute);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [routes]);

  return null;
}

export default Preloader;
