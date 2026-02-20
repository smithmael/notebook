import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = useAuthStore((state) => state.token);
  const userRole = useAuthStore((state) => state.userRole);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);

  if (!_hasHydrated) return null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Always redirect to "/" if unauthorized. 
  // App.tsx handles the logic of where to send specific roles from there.
  if (allowedRoles && !allowedRoles.includes(userRole || '')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};