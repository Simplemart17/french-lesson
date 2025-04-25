import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/api';

// Higher-order component for protected routes
export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const WithAuthComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Check if user is authenticated
      const checkAuth = () => {
        const authenticated = authService.isAuthenticated();

        if (!authenticated) {
          // If not authenticated, redirect to login page
          router.replace('/login?redirect=' + encodeURIComponent(router.asPath));
        } else {
          setIsAuthenticated(true);
          setLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    // Show nothing while checking authentication
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      );
    }

    // If authenticated, render the protected component
    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return WithAuthComponent;
} 