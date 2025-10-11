import { useAuthStore } from '@/stores/useAuthStore';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to='/auth/login' />;
}

export default PrivateRoute;
