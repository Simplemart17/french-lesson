import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../utils/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' },
      legacyError: 'Method not allowed'
    });
  }

  try {
    const { apiKey } = req.body;

    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'API key is required' },
        legacyError: 'API key is required'
      });
    }

    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid API key format' },
        legacyError: 'Invalid API key format'
      });
    }

    // Set key in process.env for the current server session only.
    // Never write secrets to the filesystem.
    process.env.OPENAI_API_KEY = apiKey;

    return res.status(200).json({
      success: true,
      data: { saved: true },
      saved: true
    });
  } catch (error) {
    console.error('Error setting API key:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to set API key' },
      legacyError: 'Failed to set API key'
    });
  }
}

export default authMiddleware(handler);
