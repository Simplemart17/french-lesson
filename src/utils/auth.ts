import { NextApiRequest } from "next";
import { supabase } from "@/lib/supabase";

/**
 * Check if the request is authenticated using Supabase auth
 */
export async function isAuthenticated(req: NextApiRequest): Promise<boolean> {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;

  const token = authHeader.split(" ")[1];
  if (!token) return false;

  try {
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
      console.error('Auth verification error:', error.message);
      return false;
    }
    return !!user;
  } catch (err) {
    console.error('Auth verification exception:', err);
    return false;
  }
}

/**
 * Gets the user ID from the authenticated request using Supabase auth
 */
export async function getUserIdFromToken(req: NextApiRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    // Get user from Supabase auth
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
      console.error('Get user ID error:', error.message);
      return null;
    }
    return user ? user.id : null;
  } catch (err) {
    console.error('Get user ID exception:', err);
    return null;
  }
}

// Define the user type for the request
interface RequestWithUser extends NextApiRequest {
  user?: {
    id: string;
    [key: string]: unknown;
  };
}

export async function getUserId(req: NextApiRequest): Promise<string | null> {
  // First try to get from the user object attached by authMiddleware
  const userReq = req as RequestWithUser;
  if (userReq.user && userReq.user.id) {
    return userReq.user.id;
  }

  // Fallback to token-based extraction
  const id = await getUserIdFromToken(req);
  return id;
}
