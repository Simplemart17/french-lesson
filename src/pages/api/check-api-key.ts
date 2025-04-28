import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if API key is set in environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Return whether the key is set or not
    res.status(200).json({ keySet: !!apiKey });
  } catch (error) {
    console.error('Error checking API key:', error);
    res.status(500).json({ error: 'Failed to check API key' });
  }
}
