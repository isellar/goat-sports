import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hockey-blue"></div>
      </div>
    );
  }

  if (!session) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 