import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryProvider } from './providers';
import { Route, RouterProvider, createRoutesFromElements } from 'react-router';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import AuthLayout from './layout/auth-layout.tsx';
import LoginPage from './pages/auth/login.tsx';
import ForgotPasswordPage from './pages/auth/forgot-password.tsx';
import ProfilePage from './pages/dashboard/profile.tsx';
import HomePage from './pages/home.tsx';
import PrivateRoute from './layout/private-route.tsx';
import DashboardHomePage from './pages/dashboard/home.tsx';
import BonAPayersPage from './pages/dashboard/bon-a-payers/index.tsx';
import CreerBonAPayerPage from './pages/dashboard/bon-a-payers/creer.tsx';
import BonAPayerDetailsPage from './pages/dashboard/bon-a-payers/details.tsx';
import BonAPayerPrevisualisationPage from './pages/dashboard/bon-a-payers/previsualisation.tsx';
import UtilisateursPage from './pages/dashboard/utilisateurs.tsx';
import ParametresPage from './pages/dashboard/parametres.tsx';
import NotFoundPage from './pages/404.tsx';
import { Toaster } from 'sonner';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<Navigate to='/auth/login' replace />} />
      <Route path='home' element={<HomePage />} />
      <Route path='auth' element={<AuthLayout />}>
        <Route path='login' element={<LoginPage />} />
        <Route path='forgot-password' element={<ForgotPasswordPage />} />
      </Route>
      <Route path='dashboard' element={<PrivateRoute />}>
        <Route index element={<DashboardHomePage />} />
        <Route path='bon-a-payers'>
          <Route index element={<BonAPayersPage />} />
          <Route path='creer' element={<CreerBonAPayerPage />} />
          <Route path=':documentId' element={<BonAPayerDetailsPage />} />
          <Route
            path=':documentId/previsualisation'
            element={<BonAPayerPrevisualisationPage />}
          />
        </Route>
        <Route path='utilisateurs' element={<UtilisateursPage />} />
        <Route path='parametres' element={<ParametresPage />} />
        <Route path='profile' element={<ProfilePage />} />
      </Route>
      <Route path='*' element={<NotFoundPage />} />
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
