import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authApiService } from '@/services';
import { User } from '@/types/api';
import { supabaseAuth } from '@/lib/supabaseAuth';

// Define the shape of the API user
interface ApiUser {
  id: string;
  name: string;
  email: string;
  level?: string;
  points?: number;
  streakDays?: number;
  joinedAt?: string;
  learningGoals?: string[];
  completedLessons?: number;
  lastActive?: string;
  dailyGoal?: number;
  notifications?: boolean;
  theme?: string;
}

// Helper function to convert API user to our User type
const convertApiUserToUser = (apiUser: ApiUser): User => {
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
      theme: (apiUser.theme || 'light') as 'light' | 'dark'
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

      // Check if we have a stored token
      const token = authApiService.getAuthToken();
      const storedUser = authApiService.getUserData();

      if (token && storedUser) {
        setUser(storedUser);
      } else {
        setUser(null);
      }
    } catch (error: unknown) {
      console.error('Auth initialization error:', error);
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

      if (response.data && response.data.success && response.data.data) {
        const { user, access_token } = response.data.data;

        if (user && access_token) {
          // Token and user data are already stored by authApiService.login
          const convertedUser = convertApiUserToUser(user as ApiUser);
          setUser(convertedUser);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login. Please try again.';
      setError(errorMessage);
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
      const { user, error: authError } = await supabaseAuth.signUp(email, password, name);

      if (authError) {
        setError(authError);
        throw new Error(authError);
      }

      if (user) {
        setUser(user);
      }

      // Force initialize to refresh auth state
      await initialize();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register. Please try again.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authApiService.logout();
      setUser(null);
    } catch {
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
