import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect if user doesn't have required role
    const roleRedirectMap: Record<UserRole, string> = {
      clipper: '/discover',
      brand: '/create-campaign',
      admin: '/admin',
      guest: '/discover'
    };
    
    const redirectPath = roleRedirectMap[user?.role || 'guest'] || '/discover';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
