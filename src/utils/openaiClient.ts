import OpenAI from 'openai';
import fs from 'fs';

let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    
    openaiInstance = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: false // Only use on server-side
    });
  }
  
  return openaiInstance;
}

// Helper function to handle audio data for Whisper API
export async function createAudioTranscription(
  audioFile: string | Buffer | fs.ReadStream
): Promise<string> {
  const openai = getOpenAIClient();
  
  let tempFilePath: string | null = null;

  try {
    let file: fs.ReadStream;

    if (typeof audioFile === 'string') {
      // If it's a file path
      file = fs.createReadStream(audioFile);
    } else if (audioFile instanceof Buffer) {
      // Create a temporary file for the buffer
      tempFilePath = `/tmp/audio-${Date.now()}.webm`;
      fs.writeFileSync(tempFilePath, audioFile);
      file = fs.createReadStream(tempFilePath);
    } else {
      // It's already a ReadStream
      file = audioFile as fs.ReadStream;
    }

    const response = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'fr'
    });

    return response.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  } finally {
    // Clean up temporary file immediately after transcription completes or fails
    if (tempFilePath) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        console.error('Failed to delete temporary file:', e);
      }
    }
  }
}

// Helper function to safely parse JSON from OpenAI responses
export function safeJSONParse(text: string) {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Error parsing JSON from OpenAI response:', error);
    // Try to extract JSON from a possibly malformed response
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerError) {
        console.error('Failed to extract JSON:', innerError);
        throw new Error('Invalid JSON response from OpenAI');
      }
    }
    throw new Error('Invalid JSON response from OpenAI');
  }
} 