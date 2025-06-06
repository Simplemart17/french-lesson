import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authApiService } from '@/services';
import { User } from '@/types/api';
import { supabaseAuth } from '@/lib/supabaseAuth';
import { supabase } from '@/lib/supabase';

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
  login: async () => { },
  register: async () => { },
  logout: async () => { },
  clearError: () => { }
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

  // Initialize auth state from Supabase session or localStorage
  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);

      const token = authApiService.getAuthToken();
      const storedUser = authApiService.getUserData();

      if (token && storedUser) {
        setUser({
          id: storedUser.id,
          name: storedUser.name,
          email: storedUser.email,
          level: 'beginner',
          points: 0,
          streakDays: 0,
          joinedAt: new Date().toISOString(),
          learningGoals: [],
          completedLessons: 0,
          lastActive: new Date().toISOString(),
          preferences: {
            dailyGoal: 30,
            notifications: true,
            theme: 'light'
          }
        });
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

  // Listen to Supabase auth state changes
  useEffect(() => {
    console.log('Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN' && session?.user) {
        // User signed in, get their profile
        const userProfile = await supabaseAuth.getUserProfile(session.user.id);
        if (userProfile) {
          setUser(userProfile);
        }
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        setUser(null);
        // Clear any stored tokens
        authApiService.logout();
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Token refreshed, ensure user is still set
        if (!user) {
          const userProfile = await supabaseAuth.getUserProfile(session.user.id);
          if (userProfile) {
            setUser(userProfile);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [user]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const authResult = await authApiService.login({ email, password });

      if (authResult.data && authResult.data.user) {
        // Map the auth user to our User type
        const user: User = {
          id: authResult.data.user.id,
          name: authResult.data.user.name,
          email: authResult.data.user.email,
          level: 'beginner',
          points: 0,
          streakDays: 0,
          joinedAt: new Date().toISOString(),
          learningGoals: [],
          completedLessons: 0,
          lastActive: new Date().toISOString(),
          preferences: {
            dailyGoal: 30,
            notifications: true,
            theme: 'light'
          }
        };
        setUser(user);
      }
      // Force initialize to refresh auth state
      await initialize();
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
    } catch (error) {
      console.error('Logout error:', error);
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
