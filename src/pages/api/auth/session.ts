import { NextApiRequest, NextApiResponse } from 'next';
import { AuthResponse, ApiResponse } from '@/types/api';
import { supabaseAuth } from '@/lib/supabaseAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<AuthResponse>>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {


    const { session, error: sessionError } = await supabaseAuth.getSession();

    if (sessionError || !session) {
      return res.status(401).json({
        success: false,
        error: {
          message: sessionError || 'No session!'
        }
      });
    }

    // Return user session
    return res.status(200).json({
      success: true,
      ...session,
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}