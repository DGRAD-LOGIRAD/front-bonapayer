import { useCallback } from 'react';
import React from 'react';

export const usePreload = () => {
  const preloadComponent = useCallback(
    (
      importFunction: () => Promise<{ default: React.ComponentType<unknown> }>
    ) => {
      importFunction().catch(() => undefined);
    },
    []
  );

  const preloadPage = useCallback(
    (pageName: string) => {
      switch (pageName) {
        case 'details':
          preloadComponent(
            () => import('../../pages/dashboard/bon-a-payers/details')
          );
          break;
        case 'previsualisation':
          preloadComponent(
            () => import('../../pages/dashboard/bon-a-payers/previsualisation')
          );
          break;
        case 'creer':
          preloadComponent(
            () => import('../../pages/dashboard/bon-a-payers/creer')
          );
          break;
        case 'list':
          preloadComponent(
            () => import('../../pages/dashboard/bon-a-payers/index')
          );
          break;
        default:
          break;
      }
    },
    [preloadComponent]
  );

  return { preloadComponent, preloadPage };
};
