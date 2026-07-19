import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Define allowed voices
const ALLOWED_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow GET (query params) and POST (JSON body) for compatibility with existing audio URLs.
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' },
      legacyError: 'Method not allowed'
    });
  }

  try {
    const input = req.method === 'GET' ? req.query : req.body;
    const text = typeof input.text === 'string' ? input.text : '';
    const voice = typeof input.voice === 'string' ? input.voice : (process.env.DEFAULT_TTS_VOICE || 'alloy');

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Text is required' },
        legacyError: 'Text is required'
      });
    }

    // Validate voice
    if (!ALLOWED_VOICES.includes(voice)) {
      const message = `Invalid voice. Allowed voices: ${ALLOWED_VOICES.join(', ')}`;
      return res.status(400).json({
        success: false,
        error: { message },
        legacyError: message
      });
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: { message: 'OpenAI API key not configured' },
        legacyError: 'OpenAI API key not configured'
      });
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

    // A truncated/empty clip must not be cached and replayed to every learner
    if (buffer.length < 100) {
      console.error(`TTS returned a suspiciously small buffer (${buffer.length} bytes)`);
      return res.status(502).json({
        success: false,
        error: { message: 'Text-to-speech returned invalid audio. Please try again.' },
        legacyError: 'Text-to-speech returned invalid audio. Please try again.'
      });
    }

    // Set response headers. The same text+voice always produces equivalent audio,
    // so let the CDN and browser cache GET responses instead of re-billing OpenAI.
    // Bounded lifetimes (1 day browser / 7 days CDN, no immutable) so a transient
    // bad clip ages out rather than being pinned for a month.
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    }

    // Send the audio data
    res.send(buffer);
  } catch (error: unknown) {
    console.error('Error generating speech:', error);
    
    // Return appropriate error response
    if (error && typeof error === 'object' && 'status' in error) {
      const errorWithStatus = error as { status: number };
      if (errorWithStatus.status === 401) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid OpenAI API key' },
          legacyError: 'Invalid OpenAI API key'
        });
      } else if (errorWithStatus.status === 429) {
        return res.status(429).json({
          success: false,
          error: { message: 'OpenAI API rate limit exceeded' },
          legacyError: 'OpenAI API rate limit exceeded'
        });
      }
    }
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to generate speech' },
      legacyError: 'Failed to generate speech'
    });
  }
}

export default handler;
