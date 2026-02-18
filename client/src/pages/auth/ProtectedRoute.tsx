import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = useAuthStore((state) => state.token);
  const userRole = useAuthStore((state) => state.userRole);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);

  // 🛑 STOP the "dive" here. If we haven't hydrated, show a blank or loader
  if (!_hasHydrated) {
    return null; // or <LoadingSpinner />
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole || '')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};