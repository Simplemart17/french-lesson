import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' },
      legacyError: 'Method not allowed'
    });
  }

  try {
    // Check if API key is set in environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Return whether the key is set or not
    return res.status(200).json({
      success: true,
      data: { keySet: !!apiKey },
      keySet: !!apiKey
    });
  } catch (error) {
    console.error('Error checking API key:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to check API key' },
      legacyError: 'Failed to check API key'
    });
  }
}
