import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryProvider } from './providers';
import { Route, RouterProvider, createRoutesFromElements } from 'react-router';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { SuspenseWrapper } from '@/components/ui/suspense-wrapper';
import { Toaster } from 'sonner';

const AuthLayout = lazy(() => import('./layout/auth-layout.tsx'));
const PrivateRoute = lazy(() => import('./layout/private-route.tsx'));

const LoginPage = lazy(() => import('./pages/auth/login.tsx'));
const ForgotPasswordPage = lazy(
  () => import('./pages/auth/forgot-password.tsx')
);

const HomePage = lazy(() => import('./pages/home.tsx'));
const NotFoundPage = lazy(() => import('./pages/404.tsx'));

const DashboardHomePage = lazy(() => import('./pages/dashboard/home.tsx'));
const ProfilePage = lazy(() => import('./pages/dashboard/profile.tsx'));
const UtilisateursPage = lazy(
  () => import('./pages/dashboard/utilisateurs.tsx')
);
const ParametresPage = lazy(() => import('./pages/dashboard/parametres.tsx'));

const BonAPayersPage = lazy(
  () => import('./pages/dashboard/bon-a-payers/index.tsx')
);
const CreerBonAPayerPage = lazy(
  () => import('./pages/dashboard/bon-a-payers/creer.tsx')
);
const BonAPayerDetailsPage = lazy(
  () => import('./pages/dashboard/bon-a-payers/details.tsx')
);
const BonAPayerPrevisualisationPage = lazy(
  () => import('./pages/dashboard/bon-a-payers/previsualisation.tsx')
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<Navigate to='/auth/login' replace />} />
      <Route
        path='home'
        element={
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        }
      />
      <Route
        path='auth'
        element={
          <SuspenseWrapper>
            <AuthLayout />
          </SuspenseWrapper>
        }
      >
        <Route
          path='login'
          element={
            <SuspenseWrapper>
              <LoginPage />
            </SuspenseWrapper>
          }
        />
        <Route
          path='forgot-password'
          element={
            <SuspenseWrapper>
              <ForgotPasswordPage />
            </SuspenseWrapper>
          }
        />
      </Route>
      <Route
        path='dashboard'
        element={
          <SuspenseWrapper>
            <PrivateRoute />
          </SuspenseWrapper>
        }
      >
        <Route
          index
          element={
            <SuspenseWrapper>
              <DashboardHomePage />
            </SuspenseWrapper>
          }
        />
        <Route path='bon-a-payers'>
          <Route
            index
            element={
              <SuspenseWrapper>
                <BonAPayersPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path='creer'
            element={
              <SuspenseWrapper>
                <CreerBonAPayerPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path=':documentId'
            element={
              <SuspenseWrapper>
                <BonAPayerDetailsPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path=':documentId/previsualisation'
            element={
              <SuspenseWrapper>
                <BonAPayerPrevisualisationPage />
              </SuspenseWrapper>
            }
          />
        </Route>
        <Route
          path='utilisateurs'
          element={
            <SuspenseWrapper>
              <UtilisateursPage />
            </SuspenseWrapper>
          }
        />
        <Route
          path='parametres'
          element={
            <SuspenseWrapper>
              <ParametresPage />
            </SuspenseWrapper>
          }
        />
        <Route
          path='profile'
          element={
            <SuspenseWrapper>
              <ProfilePage />
            </SuspenseWrapper>
          }
        />
      </Route>
      <Route
        path='*'
        element={
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        }
      />
    </Route>
  )
);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster richColors />
    </QueryProvider>
  </StrictMode>
);
