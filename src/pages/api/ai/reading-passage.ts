import type { NextApiResponse } from 'next';
import { getOpenAIClient, safeJSONParse } from '@/utils/openaiClient';
import { authMiddleware } from '@/utils/authMiddleware';
import { AuthenticatedRequest } from '@/types/api';
import { getOrCreateUserProfile } from '@/utils/userProfile';
import { isCefrLevel } from '@/lib/curriculum';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: { message: 'User not authenticated' } });
    }

    const { topic } = req.body as { topic?: string };
    const { data: user } = await getOrCreateUserProfile(userId);
    const level = isCefrLevel(user?.level) ? user!.level : 'A1';

    const lengthByLevel: Record<string, string> = {
      A1: '60-90 words, present tense, very common vocabulary',
      A2: '100-140 words, simple past and future allowed',
      B1: '160-220 words, varied tenses and connectors',
      B2: '220-300 words, nuanced vocabulary and structures',
      C1: '300-380 words, sophisticated register and idiom',
      C2: '350-450 words, native-level prose with stylistic richness'
    };

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a French graded-reader author. Write an engaging passage for a CEFR ${level} learner (${lengthByLevel[level]})${topic ? ` about: ${topic}` : ' on an interesting everyday or cultural topic'}.

Respond with ONLY a JSON object:
{
  "title": "short French title",
  "passage": "the French passage",
  "glossary": [{"french": "word or phrase from the passage", "english": "translation"}],
  "questions": [
    {"question": "comprehension question in French", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "brief explanation"}
  ]
}

Include 8-15 glossary entries covering the passage's hardest words (single words or short phrases exactly as they appear, lowercase). Include exactly 4 comprehension questions.`
        },
        { role: 'user', content: 'Write the passage now.' }
      ],
      temperature: 0.8,
      max_tokens: 1800,
      response_format: { type: 'json_object' }
    });

    const parsed = safeJSONParse(response.choices[0].message.content || '{}');
    if (!parsed.passage || !Array.isArray(parsed.questions)) {
      return res.status(502).json({ success: false, error: { message: 'Could not generate a passage. Please try again.' } });
    }

    return res.status(200).json({
      success: true,
      data: { level, ...parsed }
    });
  } catch (error) {
    console.error('Reading passage error:', error);
    return res.status(500).json({ success: false, error: { message: 'Failed to generate passage' } });
  }
}

export default authMiddleware(handler);
