import { lazy } from 'react';

// Pages lazy-loaded avec monitoring de performance
export const BonAPayerDetailsPage = lazy(() =>
  import('../pages/dashboard/bon-a-payers/details').then(module => {
    if (import.meta.env.DEV) {
      console.log('📄 BonAPayerDetailsPage loaded');
    }
    return { default: module.default };
  })
);

export const BonAPayerPrevisualisationPage = lazy(() =>
  import('../pages/dashboard/bon-a-payers/previsualisation').then(module => {
    if (import.meta.env.DEV) {
      console.log('📄 BonAPayerPrevisualisationPage loaded');
    }
    return { default: module.default };
  })
);

export const BonAPayerCreerPage = lazy(() =>
  import('../pages/dashboard/bon-a-payers/creer').then(module => {
    if (import.meta.env.DEV) {
      console.log('📄 BonAPayerCreerPage loaded');
    }
    return { default: module.default };
  })
);

// Autres pages qui pourraient bénéficier du lazy loading
export const BonAPayersListPage = lazy(() =>
  import('../pages/dashboard/bon-a-payers/index').then(module => ({
    default: module.default,
  }))
);

export const HomePage = lazy(() =>
  import('../pages/dashboard/home').then(module => ({
    default: module.default,
  }))
);

export const ParametresPage = lazy(() =>
  import('../pages/dashboard/parametres').then(module => ({
    default: module.default,
  }))
);

export const ProfilePage = lazy(() =>
  import('../pages/dashboard/profile').then(module => ({
    default: module.default,
  }))
);

export const UtilisateursPage = lazy(() =>
  import('../pages/dashboard/utilisateurs').then(module => ({
    default: module.default,
  }))
);

export const LoginPage = lazy(() =>
  import('../pages/auth/login').then(module => ({
    default: module.default,
  }))
);

export const ForgotPasswordPage = lazy(() =>
  import('../pages/auth/forgot-password').then(module => ({
    default: module.default,
  }))
);

export const NotFoundPage = lazy(() =>
  import('../pages/404').then(module => ({
    default: module.default,
  }))
);

export const ServerErrorPage = lazy(() =>
  import('../pages/500').then(module => ({
    default: module.default,
  }))
);
