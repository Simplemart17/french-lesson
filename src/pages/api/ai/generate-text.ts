import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenAIClient } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { prompt, max_tokens: requestedMaxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: { message: 'Prompt is required' }
      });
    }

    const openai = getOpenAIClient();

    // Allow callers to request higher token limits (e.g. lesson generation needs ~4000)
    const maxTokens = Math.min(requestedMaxTokens || 4096, 8192);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates text based on user prompts. When asked to produce JSON, return ONLY valid JSON with no markdown fences or extra text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: maxTokens
    });

    const text = response.choices[0].message.content || '';
    const payload = { text };

    return res.status(200).json({
      success: true,
      data: payload,
      ...payload
    });
  } catch (error) {
    console.error('Text generation error:', error);
    return res.status(500).json({ 
      success: false, 
      error: { message: 'Failed to generate text' } 
    });
  }
}

export default authMiddleware(handler);
