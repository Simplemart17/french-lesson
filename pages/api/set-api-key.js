/**
 * API endpoint to set the OpenAI API key
 * 
 * Note: In a production environment, you would want to store this
 * securely in environment variables or a secure key management system.
 * This is a simplified example for demonstration purposes.
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey } = req.body;
    
    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    // Validate the API key format (basic check)
    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      return res.status(400).json({ error: 'Invalid API key format' });
    }
    
    // In a real application, you would store this in environment variables
    // or a secure key management system. For this demo, we're setting it
    // in the current process environment.
    process.env.OPENAI_API_KEY = apiKey;
    
    // Test the API key with a simple request
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey });
      
      // Make a simple request to verify the key works
      await openai.models.list();
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error validating OpenAI API key:', error);
      return res.status(400).json({ 
        error: 'Invalid API key. Please check your key and try again.',
        details: error.message 
      });
    }
  } catch (error) {
    console.error('Error setting API key:', error);
    res.status(500).json({ error: 'Failed to set API key' });
  }
}
