import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authApiService, userApiService } from '@/services';
import { User } from '@/types/api';
import { AuthService } from '@/utils/authService';

// Helper function to convert API user to our User type
const convertApiUserToUser = (apiUser: any): User => {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    level: apiUser.level || 'A1',
    points: apiUser.points || 0,
    streakDays: apiUser.streakDays || 0,
    joinedAt: apiUser.joinedAt || new Date().toISOString(),
    learningGoals: apiUser.learningGoals || [],
    completedLessons: apiUser.completedLessons || 0,
    lastActive: apiUser.lastActive || new Date().toISOString(),
    preferences: {
      dailyGoal: apiUser.dailyGoal || 15,
      notifications: apiUser.notifications !== undefined ? apiUser.notifications : true,
      theme: apiUser.theme || 'light'
    }
  };
};

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
          const response = await userApiService.getProfile();
          // Convert API user profile to our User type
          if (response.data) {
            setUser(convertApiUserToUser(response.data));
          }
        } catch (profileError) {

          // If API call fails but we have stored user data, keep using that
          if (!storedUser) {
            // Only logout if we don't have stored user data
            await authApiService.logout();
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
      const response = await authApiService.login({ email, password });

      // Set user state if response is successful
      if (response.data && response.data.user) {
        setUser(convertApiUserToUser(response.data.user));
      }

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
      const response = await authApiService.register({
        name,
        email,
        password,
        passwordConfirmation: password // Use the same password for confirmation
      });

      // Set user state if response is successful
      if (response.data && response.data.user) {
        setUser(convertApiUserToUser(response.data.user));
      }

      // Force initialize to refresh auth state
      await initialize();
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
      await authApiService.logout();
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
