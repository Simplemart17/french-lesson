import { parseCookies, setCookie, destroyCookie } from 'nookies';

// Constants
const TOKEN_NAME = 'token';
// Cookie lifetime in seconds (30 days)
const MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Set the authentication token cookie
 */
export const setAuthCookie = (token: string) => {
  setCookie(null, TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

/**
 * Get the authentication token from cookies
 */
export const getAuthCookie = () => {
  const cookies = parseCookies();
  return cookies[TOKEN_NAME];
};

/**
 * Remove the authentication token cookie
 */
export const removeAuthCookie = () => {
  destroyCookie(null, TOKEN_NAME, { path: '/' });
};

/**
 * Check if the user is authenticated based on cookie presence
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthCookie();
}; 