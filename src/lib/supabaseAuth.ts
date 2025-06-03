import { supabase } from './supabase';
import { User } from '@/types/api';
import { TABLES } from './supabase';

export interface SupabaseAuthUser {
  id: string;
  email?: string;
  user_metadata: {
    name?: string;
  };
}

export interface AuthResult {
  user: User | null;
  error: string | null;
  session?: AuthSession | null;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: SupabaseAuthUser;
}

export interface MapUser {
    id: string;
    name: string;
    email: string;
    level: string;
    points: number;
    streakDays: number;
    joinedAt: string;
    learningGoals: string[];
    completedLessons: number;
    lastActive: string;
    dailyGoal: number;
    notifications: boolean;
    theme: 'light' | 'dark';
  }

/**
 * Enhanced Supabase Authentication Service
 * Handles user authentication and profile management with proper Supabase Auth integration
 */
export const supabaseAuth = {
  /**
   * Sign up a new user with Supabase Auth and create profile
   */
  signUp: async (email: string, password: string, name: string): Promise<AuthResult> => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Failed to create user' };
      }

      // Create user profile in our User table (without password field)
      const userProfile = await supabaseAuth.createUserProfile(authData.user.id, {
        name,
        email,
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

      return {
        user: userProfile,
        error: null,
        session: authData.session
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return { user: null, error: errorMessage };
    }
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user || !authData.session) {
        return { user: null, error: 'Authentication failed' };
      }

      // Get user profile from our User table
      const userProfile = await supabaseAuth.getUserProfile(authData.user.id);

      if (!userProfile) {
        return { user: null, error: 'User profile not found' };
      }

      return {
        user: userProfile,
        error: null,
        session: authData.session
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { user: null, error: errorMessage };
    }
  },

  /**
   * Sign out the current user
   */
  signOut: async (): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      return { error: errorMessage };
    }
  },

  /**
   * Get current session
   */
  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return { session: null, error: error.message };
      }
      return { session, error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get session';
      return { session: null, error: errorMessage };
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        return { user: null, error: error.message };
      }
      return { user, error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get current user';
      return { user: null, error: errorMessage };
    }
  },

  /**
   * Send password reset email
   */
  resetPassword: async (email: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      return { error: errorMessage };
    }
  },

  /**
   * Update password
   */
  updatePassword: async (newPassword: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Password update failed';
      return { error: errorMessage };
    }
  },

  /**
   * Resend email confirmation
   */
  resendConfirmation: async (email: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend confirmation';
      return { error: errorMessage };
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUserProfile: async (): Promise<User | null> => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();

      if (error || !authUser) {
        return null;
      }

      return await supabaseAuth.getUserProfile(authUser.id);
    } catch {
      return null;
    }
  },

  /**
   * Create user profile in User table
   */
  createUserProfile: async (authUserId: string, profileData: Partial<User>): Promise<User | null> => {
    try {
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .insert({
          id: authUserId, // Use Supabase Auth user ID
          name: profileData.name,
          email: profileData.email,
          level: profileData.level || 'A1',
          points: profileData.points || 0,
          streakDays: profileData.streakDays || 0,
          learningGoals: profileData.learningGoals || [],
          completedLessons: profileData.completedLessons || 0,
          lastActive: new Date().toISOString(),
          dailyGoal: profileData.preferences?.dailyGoal || 15,
          notifications: profileData.preferences?.notifications ?? true,
          theme: profileData.preferences?.theme || 'light',
          joinedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }

      return supabaseAuth.mapDbUserToUser(user);
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  },

  /**
   * Get user profile from User table, create if doesn't exist
   */
  getUserProfile: async (authUserId: string): Promise<User | null> => {
    try {
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', authUserId)
        .single();

      if (error || !user) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return supabaseAuth.mapDbUserToUser(user);
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  },

  /**
   * Map database user to User type
   */
  mapDbUserToUser: (dbUser: MapUser): User => {
    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      level: dbUser.level,
      points: dbUser.points,
      streakDays: dbUser.streakDays,
      joinedAt: dbUser.joinedAt,
      learningGoals: dbUser.learningGoals,
      completedLessons: dbUser.completedLessons,
      lastActive: dbUser.lastActive,
      preferences: {
        dailyGoal: dbUser.dailyGoal,
        notifications: dbUser.notifications,
        theme: dbUser.theme as 'light' | 'dark',
      }
    };
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userProfile = await supabaseAuth.getUserProfile(session.user.id);
        callback(userProfile);
      } else {
        callback(null);
      }
    });
  }
};
