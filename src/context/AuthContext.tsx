import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService, userService } from '@/services/api';
import { User } from '@/types/api';
import { AuthService } from '@/utils/authService';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {}
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from stored data
  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);

      if (AuthService.isAuthenticated()) {

        // Try to get user data from cookie first (faster)
        const storedUser = AuthService.getUserData();

        if (storedUser) {
          setUser(storedUser);
        }

        // Then try to refresh user data from API
        try {
          const userData = await userService.getProfile();
          setUser(userData);
        } catch (profileError) {

          // If API call fails but we have stored user data, keep using that
          if (!storedUser) {
            // Only logout if we don't have stored user data
            await authService.logout();
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  // Initialize on first load
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);

      // Set user state
      setUser(response.user);

      // Force initialize to refresh auth state
      await initialize();
    } catch (error: any) {
      setError(error.message || 'Failed to login. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(name, email, password);
      setUser(response.user);
    } catch (error: any) {
      setError(error.message || 'Failed to register. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);

    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      // Even if the API call fails, we still want to clear local state
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear any auth errors
  const clearError = () => {
    setError(null);
  };

  // Create the context value object
  const contextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
