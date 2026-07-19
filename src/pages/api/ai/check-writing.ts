import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenAIClient, safeJSONParse } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { text, context } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: { message: 'Text is required' }
      });
    }

    const openai = getOpenAIClient();

    const contextInstruction = context
      ? `The user is writing about: ${context}. `
      : '';

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a French language writing assistant. ${contextInstruction}When provided with French text, analyze it for grammar, spelling, vocabulary, and style issues.

Format your response as a JSON object with this exact structure:
{
  "corrections": [
    {
      "original": "the incorrect phrase",
      "corrected": "the corrected phrase",
      "explanation": "Brief explanation of what was wrong and why the correction is needed"
    }
  ],
  "feedback": "Overall assessment of the writing quality, what was done well, and areas for improvement",
  "score": 85
}

The score should be 0-100 based on overall writing quality.
If the text is perfect, return an empty corrections array with positive feedback.
Only respond with the JSON object and nothing else.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const result = safeJSONParse(response.choices[0].message.content || '{}');

    return res.status(200).json({
      success: true,
      data: result,
      result
    });
  } catch (error) {
    console.error('Writing check error:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to check writing' }
    });
  }
}

export default authMiddleware(handler);
