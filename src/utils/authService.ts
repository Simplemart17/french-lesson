import { getAuthToken, setAuthToken, clearAuthCookies, setUserData, getUserData } from './authCookies';
import { User } from '@/types/api';

/**
 * Authentication service with enhanced functionality
 */
export const AuthService = {
  /**
   * Check if the user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  /**
   * Set authentication token and user data
   */
  setAuth: (token: string, userData: User): void => {
    setAuthToken(token);
    setUserData(userData);
  },

  /**
   * Clear all authentication data
   */
  clearAuth: (): void => {
    clearAuthCookies();
  },

  /**
   * Get the authentication token
   */
  getToken: (): string | null => {
    return getAuthToken();
  },

  /**
   * Get the current user data
   */
  getUserData: (): User | null => {
    return getUserData();
  },

  /**
   * Validate token format (basic check)
   */
  isValidToken: (token: string): boolean => {
    // Basic JWT format validation
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    return jwtRegex.test(token);
  }
};
