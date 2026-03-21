/**
 * Simplified Authentication Storage
 * Uses localStorage for user data caching only.
 * Token management is handled by Supabase directly — apiClient reads from supabase.auth.getSession().
 */

const USER_KEY = 'supabase_user_data';

/**
 * Define the user data type
 */
export interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Set user data
 */
export const setUserData = (userData: UserData): void => {
  if (typeof window !== 'undefined') {
    // Remove sensitive data if present
    const safeUserData = { ...userData } as UserData & { password?: string };
    delete safeUserData.password;
    localStorage.setItem(USER_KEY, JSON.stringify(safeUserData));
  }
};

/**
 * Get user data
 */
export const getUserData = (): UserData | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData) as UserData;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
  }
  return null;
};

/**
 * Clear all authentication data
 */
export const clearAuthCookies = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);

    // Clear all Supabase internal session keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.startsWith('supabase'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
};
