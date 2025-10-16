import { useCallback } from 'react';
import React from 'react';

// Hook pour précharger les composants lazy
export const usePreload = () => {
  const preloadComponent = useCallback(
    (
      importFunction: () => Promise<{ default: React.ComponentType<unknown> }>
    ) => {
      // Précharge le composant en arrière-plan
      importFunction().catch(error => {
        console.warn('Preload failed:', error);
      });
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
          console.warn(`Unknown page: ${pageName}`);
      }
    },
    [preloadComponent]
  );

  return { preloadComponent, preloadPage };
};
