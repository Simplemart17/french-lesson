import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Define allowed voices
const ALLOWED_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get text and voice from request body
    const { text, voice = 'alloy' } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Validate voice
    if (!ALLOWED_VOICES.includes(voice)) {
      return res.status(400).json({ error: `Invalid voice. Allowed voices: ${ALLOWED_VOICES.join(', ')}` });
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Generate speech
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice,
      input: text,
    });

    // Convert to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Set response headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    
    // Send the audio data
    res.send(buffer);
  } catch (error: unknown) {
    console.error('Error generating speech:', error);
    
    // Return appropriate error response
    if (error && typeof error === 'object' && 'status' in error) {
      const errorWithStatus = error as { status: number };
      if (errorWithStatus.status === 401) {
        return res.status(401).json({ error: 'Invalid OpenAI API key' });
      } else if (errorWithStatus.status === 429) {
        return res.status(429).json({ error: 'OpenAI API rate limit exceeded' });
      }
    }
    return res.status(500).json({ error: 'Failed to generate speech' });
  }
}
