import { NextApiRequest } from "next";
import { verify } from "jsonwebtoken";

// Secret key for JWT verification - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Gets the user ID from the authenticated request
 * In a real application, this would decode the JWT token or retrieve from session
 */
export function getUserIdFromToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  // Development mode: Return test user ID for test tokens
  if (process.env.NODE_ENV === 'development' && token.startsWith('test-token-')) {
    return 'test-user-id';
  }

  try {
    // Decode and verify the token
    const decoded = verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
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

// Helper to get user ID, with fallback for development
export function getUserId(req: NextApiRequest): string | null {
  // First try to get from the user object attached by authMiddleware
  const userReq = req as RequestWithUser;
  if (userReq.user && userReq.user.id) {
    return userReq.user.id;
  }

  // Fallback to token-based extraction
  const id = getUserIdFromToken(req);
  return id;
}
