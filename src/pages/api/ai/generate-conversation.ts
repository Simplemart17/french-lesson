import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenAIClient, safeJSONParse } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { topic, level = 'beginner', context } = req.body;

    if (!topic) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Topic is required' } 
      });
    }

    // Prepare context based on level
    let systemContext = `You are a French language learning assistant. Create a realistic conversation in French between two people about "${topic}" appropriate for ${level} level students. `;
    
    // Add specific instructions based on level
    if (level === 'beginner') {
      systemContext += 'Use simple vocabulary, short sentences, and basic grammar structures. Focus on everyday topics.';
    } else if (level === 'intermediate') {
      systemContext += 'Use a mix of simple and more complex sentences. Include some idiomatic expressions and varied tenses.';
    } else if (level === 'advanced') {
      systemContext += 'Use sophisticated vocabulary, complex sentence structures, and a variety of tenses. Include colloquialisms and cultural references.';
    }

    // Additional context if provided
    if (context) {
      systemContext += ` Additional context: ${context}`;
    }

    // Format instructions
    systemContext += `
    Format your response as a JSON object with the following structure:
    {
      "conversation": [
        { "role": "person1", "content": "French text" },
        { "role": "person2", "content": "French response" },
        ...
      ],
      "vocabulary": [
        { "word": "French word", "translation": "English translation", "usage": "Example sentence" },
        ...
      ]
    }
    Include 5-10 key vocabulary words used in the conversation. Only respond with the JSON object and nothing else.`;

    // Get OpenAI client
    const openai = getOpenAIClient();

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: systemContext
        },
        {
          role: "user",
          content: `Please create a French conversation about "${topic}" for ${level} level students.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Parse the response
    const result = safeJSONParse(response.choices[0].message.content || '{}');

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Conversation generation error:', error);
    return res.status(500).json({ 
      success: false, 
      error: { message: 'Failed to generate conversation' } 
    });
  }
}

export default authMiddleware(handler); 