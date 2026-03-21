import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { authApiService } from '@/services';
import { User } from '@/types/api';
import { supabaseAuth } from '@/lib/supabaseAuth';
import { supabase } from '@/lib/supabase';
import { clearAuthCookies, getUserData } from '@/utils/authCookies';

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
  refreshUser: () => Promise<void>;
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
  clearError: () => { },
  refreshUser: async () => { }
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
  const userLoadedRef = useRef(false);

  // Initialize auth state from Supabase session or localStorage
  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);

      // Immediately hydrate from cached localStorage data for fast UI
      const cachedUser = getUserData();
      if (cachedUser && cachedUser.id) {
        setUser(cachedUser as unknown as User);
      }

      const { session } = await supabaseAuth.getSession();

      if (session?.user) {
        // Set initialized immediately so UI is unblocked
        setIsInitialized(true);
        setIsLoading(false);
        userLoadedRef.current = true;

        // Fetch full profile in background (non-blocking)
        supabaseAuth.getUserProfile(session.user.id).then(async (profile) => {
          if (!profile) {
            profile = await supabaseAuth.createUserProfile(session.user.id, {
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Learner',
              email: session.user.email || `${session.user.id}@local.invalid`,
              level: 'A1',
              points: 0,
              streakDays: 0,
              learningGoals: [],
              completedLessons: 0,
              preferences: {
                dailyGoal: 15,
                notifications: true,
                theme: 'light'
              }
            });
          }

          if (profile) {
            setUser(profile);
            authApiService.setUserData({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              level: profile.level
            });
          }
        }).catch((err) => {
          console.error('Background profile fetch error:', err);
        });
        return; // Already set initialized above
      } else {
        clearAuthCookies();
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

  // Listen to Supabase auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Skip duplicate profile fetch if user is already loaded
        if (userLoadedRef.current) return;
        userLoadedRef.current = true;

        const userProfile = await supabaseAuth.getUserProfile(session.user.id);
        if (userProfile) {
          authApiService.setUserData({
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            level: userProfile.level
          });
          setUser(userProfile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        clearAuthCookies();
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Token refresh is handled automatically by Supabase + apiClient reads from session
        // Just update user profile data if needed
        const userProfile = await supabaseAuth.getUserProfile(session.user.id);
        if (userProfile) {
          authApiService.setUserData({
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            level: userProfile.level
          });
          setUser(userProfile);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const authResult = await supabaseAuth.signIn(email, password);

      if (authResult.error) {
        throw new Error(authResult.error);
      }

      if (authResult.user) {
        setUser(authResult.user);
        authApiService.setUserData({
          id: authResult.user.id,
          name: authResult.user.name,
          email: authResult.user.email,
          level: authResult.user.level
        });
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
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase signOut error:', error);
    }

    try {
      await authApiService.logout();
    } catch (error) {
      console.error('API logout error:', error);
    }

    // Always clear local state and cookies regardless of errors
    setUser(null);
    userLoadedRef.current = false;
    clearAuthCookies();
    setIsLoading(false);
  };

  // Refresh user profile from the database
  const refreshUser = async () => {
    try {
      const { session } = await supabaseAuth.getSession();
      if (session?.user) {
        const profile = await supabaseAuth.getUserProfile(session.user.id);
        if (profile) {
          setUser(profile);
          authApiService.setUserData({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            level: profile.level
          });
        }
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
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
    clearError,
    refreshUser
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
