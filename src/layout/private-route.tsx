import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/useAuthStore';

import DashboardLayout from './dashboard-layout';

function PrivateRoute() {
  const isAuthenticated = useAuthStore();
  return isAuthenticated ? <DashboardLayout /> : <Navigate to='/auth/login' />;
}

export default PrivateRoute;
