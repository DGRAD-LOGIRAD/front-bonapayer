import { useEffect } from 'react';

interface PreloaderProps {
  routes?: string[];
}

export function Preloader({ routes = [] }: PreloaderProps) {
  useEffect(() => {
    // Précharger les routes importantes
    const importantRoutes = [
      '/dashboard',
      '/dashboard/bon-a-payers',
      '/dashboard/bon-a-payers/creer',
      ...routes,
    ];

    // Fonction pour précharger une route
    const preloadRoute = (route: string) => {
      // Créer un lien invisible pour déclencher le préchargement
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    };

    // Précharger après un délai pour ne pas impacter le chargement initial
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
