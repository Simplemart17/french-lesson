import { supabaseAuth } from '@/lib/supabaseAuth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
    await supabaseAuth.signOut();
    return res.status(200).json({
      success: true,
      data: null
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
}
