import { NextApiRequest, NextApiResponse } from 'next';

// Define supported languages for speech recognition
const SUPPORTED_LANGUAGES = [
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'fr-CA', name: 'French (Canada)' },
  { code: 'fr-CH', name: 'French (Switzerland)' },
  { code: 'fr-BE', name: 'French (Belgium)' }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return the list of supported languages
    return res.status(200).json({
      success: true,
      data: SUPPORTED_LANGUAGES
    });
  } catch (error: unknown) {
    console.error('Error getting supported languages:', error);
    return res.status(500).json({ error: 'Failed to get supported languages' });
  }
}