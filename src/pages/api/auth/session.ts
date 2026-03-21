import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { supabaseAuth } from '@/lib/supabaseAuth';

interface SessionUserPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SessionPayload {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: SessionUserPayload;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SessionPayload>>
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

    const payload = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      user: {
        id: session.user.id,
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Learner',
        email: session.user.email || `${session.user.id}@local.invalid`,
        role: 'user'
      }
    };

    // Return user session
    return res.status(200).json({
      success: true,
      data: payload,
      ...payload
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
