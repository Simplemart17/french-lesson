import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenAIClient, safeJSONParse } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { text, level = 'beginner' } = req.body;

    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Text is required' } 
      });
    }

    // Get OpenAI client
    const openai = getOpenAIClient();

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a French language learning assistant specialized in grammar correction for ${level} level students. 
            When provided with French text, you should:
            1. Correct any grammar, spelling, or punctuation errors
            2. Provide brief explanations for each correction
            3. Format your response as a JSON object with the following structure:
            {
              "corrected": "corrected text",
              "feedback": ["general feedback point 1", "general feedback point 2"],
              "explanations": [
                {
                  "original": "original incorrect phrase",
                  "correction": "corrected phrase",
                  "rule": "explanation of the grammar rule"
                }
              ]
            }
            Only respond with the JSON object and nothing else.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    // Parse the response
    const result = safeJSONParse(response.choices[0].message.content || '{}');

    return res.status(200).json({
      success: true,
      data: result,
      result
    });
  } catch (error) {
    console.error('Grammar correction error:', error);
    return res.status(500).json({ 
      success: false, 
      error: { message: 'Failed to correct grammar' } 
    });
  }
}

export default authMiddleware(handler); 
