import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that protects routes requiring authentication
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  console.log("ProtectedRoute component rendered")
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [redirected, setRedirected] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle redirection when auth state changes
  useEffect(() => {
    // Only run on client-side and when auth is initialized and not loading
    if (isClient && isInitialized && !isLoading && !redirected) {
      if (!isAuthenticated) {
        // Set redirected flag to prevent multiple redirects
        setRedirected(true);

        // Clear any existing auth cookies to prevent loops
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirect to login page
        window.location.href = '/login';
      }
    }
  }, [isAuthenticated, isLoading, isInitialized, isClient, redirected]);

  // Show loading screen while checking authentication
  if (!isClient || isLoading || !isInitialized) {
    return fallback || <LoadingScreen />;
  }

  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
