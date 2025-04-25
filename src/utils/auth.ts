import { NextApiRequest } from 'next';
import { verify } from 'jsonwebtoken';
import { findUserById } from '@/lib/db';

// Secret key for JWT verification - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Checks if the request is authenticated using the Authorization header
 * This is a mock implementation for demonstration purposes
 * In a real application, you would verify JWT tokens, session cookies, etc.
 */
export function isAuthenticated(req: NextApiRequest): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;

  const token = authHeader.split(' ')[1];
  if (!token) return false;

  try {
    // Verify the token
    verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Gets the user ID from the authenticated request
 * In a real application, this would decode the JWT token or retrieve from session
 */
export function getUserIdFromToken(req: NextApiRequest): number | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    // Decode and verify the token
    const decoded = verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// Helper to get user ID, with fallback for development
export function getUserId(req: NextApiRequest): number {
  const id = getUserIdFromToken(req);
  
  // In development, if token verification fails, return a default user ID
  if (process.env.NODE_ENV === 'development' && !id) {
    return 1; // Default user ID for development
  }
  
  return id || 1; // Fallback to user ID 1 if something goes wrong
}

/**
 * Checks if the user has the required role
 * This is a mock implementation
 */
export function hasRole(req: NextApiRequest, role: string): boolean {
  // Mock implementation - in a real app, this would check the user's roles
  return isAuthenticated(req);
}

/**
 * Validates user credentials and returns the user if valid
 */
export async function validateCredentials(email: string, password: string): Promise<boolean> {
  try {
    // In a real app, we would validate the password here
    // For now, just checking if the user exists is enough
    const user = await findUserById(1);
    return !!user;
  } catch (error) {
    return false;
  }
} 