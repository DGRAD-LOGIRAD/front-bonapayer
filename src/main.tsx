import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryProvider } from './providers';
import { Route, RouterProvider, createRoutesFromElements } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from './layout/auth-layout.tsx';
import LoginPage from './pages/auth/login.tsx';
import ForgotPasswordPage from './pages/auth/forgot-password.tsx';
import ProfilePage from './pages/dashboard/profile.tsx';
import HomePage from './pages/home.tsx';
import PrivateRoute from './layout/private-route.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomePage />} />
      <Route path='auth' element={<AuthLayout />}>
        <Route path='login' element={<LoginPage />} />
        <Route path='forgot-password' element={<ForgotPasswordPage />} />
      </Route>
      <Route path='/dashboard' element={<PrivateRoute />}>
        <Route path='profile' element={<ProfilePage />} />
      </Route>
    </Route>
  )
);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>
);
