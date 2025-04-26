import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { AuthService } from './authService';

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

/**
 * Authentication middleware for API routes
 * 
 * @param handler The API route handler
 * @returns The handler with authentication check
 */
export function authMiddleware(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Skip auth check for specific routes
      const isPublicRoute = req.url && [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/logout',
      ].includes(req.url);
      
      if (isPublicRoute) {
        return handler(req, res);
      }

      // Get token from request headers
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Also check for auth cookie as fallback
        const token = req.cookies['auth_token'];
        
        if (!token) {
          return res.status(401).json({
            success: false,
            error: { message: 'Unauthorized - No valid authentication token' }
          });
        }
        
        // Verify token
        try {
          const decoded = verify(token, process.env.JWT_SECRET || 'default-secret');
          // Attach user to request
          (req as any).user = decoded;
        } catch (err) {
          return res.status(401).json({
            success: false,
            error: { message: 'Unauthorized - Invalid token' }
          });
        }
      } else {
        // Extract token from Bearer header
        const token = authHeader.split(' ')[1];
        
        // Verify token
        try {
          const decoded = verify(token, process.env.JWT_SECRET || 'default-secret');
          // Attach user to request
          (req as any).user = decoded;
        } catch (err) {
          return res.status(401).json({
            success: false,
            error: { message: 'Unauthorized - Invalid token' }
          });
        }
      }

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