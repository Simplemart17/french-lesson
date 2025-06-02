import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

// Create Supabase client for server-side auth verification (only if service key is available)
const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2aG1kZ2Jxam9zaGNkYnF5aXR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY1NDM3NCwiZXhwIjoyMDY0MjMwMzc0fQ.Ej6mJOQJGKJOQJGKJOQJGKJOQJGKJOQJGKJOQJGKJOQ'
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  : null;

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

      // Development mode: Accept test tokens
      if (process.env.NODE_ENV === 'development' && token.startsWith('test-token-')) {
        // Create a mock user for development
        const mockUser = {
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: {
            name: 'Test User'
          }
        };

        // Attach mock user to request
        (req as any).user = mockUser;

        // Proceed to handler
        return handler(req, res);
      }

      // Production mode: Verify token with Supabase
      if (!supabase) {
        console.error('Auth middleware - Supabase service role key not configured');
        return res.status(500).json({
          success: false,
          error: { message: 'Authentication service not configured' }
        });
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        console.log('Auth middleware - token verification failed:', error?.message);
        return res.status(401).json({
          success: false,
          error: { message: 'Unauthorized - Invalid token' }
        });
      }

      // Attach user to request
      (req as any).user = user;

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