/**
 * Simplified Authentication Storage
 * Uses localStorage only for simplicity and reliability
 */

const TOKEN_KEY = 'supabase_auth_token';
const USER_KEY = 'supabase_user_data';

/**
 * Set authentication token
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Get authentication token
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Define the user data type
 */
interface UserData {
  id: string;
  name: string;
  email: string;
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};