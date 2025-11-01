import { useCallback } from 'react';

const routeComponentMap: Record<string, () => Promise<unknown>> = {
  '/dashboard': () => import('@/pages/dashboard/home'),
  '/dashboard/profile': () => import('@/pages/dashboard/profile'),
  '/dashboard/utilisateurs': () => import('@/pages/dashboard/utilisateurs'),
  '/dashboard/parametres': () => import('@/pages/dashboard/parametres'),
  '/dashboard/bon-a-payers': () =>
    import('@/pages/dashboard/bon-a-payers/index'),
  '/dashboard/bon-a-payers/creer': () =>
    import('@/pages/dashboard/bon-a-payers/creer'),
};

const prefetchCache = new Set<string>();

export function usePrefetchRoute() {
  const prefetchRoute = useCallback((path: string) => {
    if (prefetchCache.has(path)) {
      return;
    }

    const componentLoader = routeComponentMap[path];

    if (componentLoader) {
      prefetchCache.add(path);
      componentLoader().catch(() => {
        prefetchCache.delete(path);
      });
    }
  }, []);

  return { prefetchRoute };
}

