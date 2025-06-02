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
 * Set user data
 */
export const setUserData = (userData: any): void => {
  if (typeof window !== 'undefined') {
    // Remove sensitive data
    const { password, ...safeUserData } = userData;
    localStorage.setItem(USER_KEY, JSON.stringify(safeUserData));
  }
};

/**
 * Get user data
 */
export const getUserData = (): any => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
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