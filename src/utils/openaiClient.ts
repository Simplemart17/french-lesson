import OpenAI from 'openai';

// Create a singleton OpenAI client
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
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