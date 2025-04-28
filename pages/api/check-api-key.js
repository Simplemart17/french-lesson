/**
 * API endpoint to check if the OpenAI API key is set
 */
export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if the API key is set in environment variables
  const keySet = !!process.env.OPENAI_API_KEY;
  
  res.status(200).json({ keySet });
}
