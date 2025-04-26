import { parseCookies, setCookie, destroyCookie } from 'nookies';

// Constants
const TOKEN_NAME = 'auth_token';
const USER_DATA = 'user_data';
// Cookie lifetime in seconds (30 days)
const MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Set the authentication token cookie
 */
export const setAuthToken = (token: string) => {
  setCookie(null, TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Changed from strict to lax for better UX with redirects
    // httpOnly can only be set by the server, not client-side JavaScript
  });
};

/**
 * Set user data in a cookie (non-sensitive info only)
 */
export const setUserData = (userData: any) => {
  // Remove sensitive data before storing
  const { password, ...safeUserData } = userData;

  setCookie(null, USER_DATA, JSON.stringify(safeUserData), {
    maxAge: MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};

/**
 * Get the authentication token from cookies
 */
export const getAuthToken = () => {
  const cookies = parseCookies();
  console.log('token>>>>>>>>>>>>>>>>>', cookies[TOKEN_NAME]);
  return cookies[TOKEN_NAME];
};

/**
 * Get user data from cookies
 */
export const getUserData = () => {
  const cookies = parseCookies();
  if (!cookies[USER_DATA]) return null;

  try {
    // First decode the URI component, then parse the JSON
    const decodedData = decodeURIComponent(cookies[USER_DATA]);
    return JSON.parse(decodedData);
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    return null;
  }
};

/**
 * Remove all authentication cookies
 */
export const clearAuthCookies = () => {
  destroyCookie(null, TOKEN_NAME, { path: '/' });
  destroyCookie(null, USER_DATA, { path: '/' });
};

/**
 * Check if the user is authenticated based on token presence
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};