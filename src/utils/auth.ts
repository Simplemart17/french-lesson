import { NextApiRequest } from "next";
import { verify } from "jsonwebtoken";
import { findUserById } from "@/lib/db";

// Secret key for JWT verification - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Checks if the request is authenticated using the Authorization header
 * This is a mock implementation for demonstration purposes
 * In a real application, you would verify JWT tokens, session cookies, etc.
 */
export function isAuthenticated(req: NextApiRequest): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;

  const token = authHeader.split(" ")[1];
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
export function getUserIdFromToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    // Decode and verify the token
    const decoded = verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// Helper to get user ID, with fallback for development
export function getUserId(req: NextApiRequest): string {
  const id = getUserIdFromToken(req);
  return id!;
}

/**
 * Checks if the user has the required role
 * This is a mock implementation
 */
export function hasRole(req: NextApiRequest, role: string): boolean {
  // Mock implementation - in a real app, this would check the user's roles
  return isAuthenticated(req);
}
