import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

/**
 * Simple authentication middleware for API routes
 */
export function authMiddleware(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: { message: 'Unauthorized - Missing or invalid authorization header' }
        });
      }

      const token = authHeader.substring(7);

      if (!token) {
        return res.status(401).json({
          success: false,
          error: { message: 'Unauthorized - Missing token' }
        });
      }

      // Verify the token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        console.error('Auth middleware - Invalid token:', error?.message);
        return res.status(401).json({
          success: false,
          error: { message: 'Unauthorized - Invalid token' }
        });
      }

      // Attach user to request
      (req as NextApiRequest & { user?: unknown }).user = user;

      // Proceed to handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Internal Server Error' }
      });
    }
  };
}