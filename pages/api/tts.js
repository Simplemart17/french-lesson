import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice = 'alloy' } = req.body;
    
    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Generate speech using OpenAI's TTS API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice, // Options: alloy, echo, fable, onyx, nova, shimmer
      input: text,
      language: "fr", // Specify French language
    });

    // Convert to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Send audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(buffer);
  } catch (error) {
    console.error('TTS API error:', error);
    
    // Return appropriate error response
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate speech',
      message: error.message 
    });
  }
}
