import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';

// Cookie constants
const TOKEN_NAME = 'auth_token';
const USER_DATA = 'user_data';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ success: boolean }>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    // Clear auth cookies using Set-Cookie header with a very simple approach
    res.setHeader('Set-Cookie', [
      `${TOKEN_NAME}=; Path=/; Max-Age=0; SameSite=Lax`,
      `${USER_DATA}=; Path=/; Max-Age=0; SameSite=Lax`
    ]);

    return res.status(200).json({
      success: true,
      data: { success: true }
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
