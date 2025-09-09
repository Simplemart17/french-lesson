import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenAIClient } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Prompt is required' } 
      });
    }

    const openai = getOpenAIClient();

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates text based on user prompts. The response should be in Markdown format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const text = response.choices[0].message.content || '';

    return res.status(200).json({
      success: true,
      data: { text }
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
