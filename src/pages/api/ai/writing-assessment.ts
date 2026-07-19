import type { NextApiResponse } from 'next';
import { getOpenAIClient, safeJSONParse } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';
import { AuthenticatedRequest } from '@/types/api';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { recordActivity, updateUserXpAndStreak } from '@/utils/progressTracker';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { text, task, level = 'B1' } = req.body as {
      text?: string;
      task?: string;
      level?: string;
    };

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: { message: 'Text is required' } });
    }
    if (!task) {
      return res.status(400).json({ success: false, error: { message: 'Task prompt is required' } });
    }

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a certified TCF/TEF French written-expression examiner. Assess the learner's text against the task using CEFR criteria. The learner's target level is ${level}.

Respond with ONLY a JSON object in exactly this structure:
{
  "overallScore": 0-100,
  "cefrEstimate": "A1"|"A2"|"B1"|"B2"|"C1"|"C2",
  "criteria": {
    "grammar": {"score": 0-100, "comment": "..."},
    "vocabulary": {"score": 0-100, "comment": "..."},
    "coherence": {"score": 0-100, "comment": "..."},
    "taskAchievement": {"score": 0-100, "comment": "..."}
  },
  "corrections": [{"original": "...", "corrected": "...", "explanation": "..."}],
  "feedback": "2-4 sentences of encouraging, concrete feedback in English"
}

Judge task achievement against the requested format and word count. If the text is off-task or far too short, score accordingly and say so.`
        },
        {
          role: 'user',
          content: `Task: ${task}\n\nLearner's text:\n"${text}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 1200,
      response_format: { type: 'json_object' }
    });

    const assessment = safeJSONParse(response.choices[0].message.content || '{}');
    const overallScore = typeof assessment.overallScore === 'number' ? assessment.overallScore : 0;

    const userId = req.user?.id;
    if (userId) {
      const db = supabaseAdmin ?? supabase;
      await recordActivity(db as never, userId, 'writing', overallScore, { task, level });
      await updateUserXpAndStreak(db as never, userId, 10);
    }

    return res.status(200).json({
      success: true,
      data: assessment,
      ...assessment
    });
  } catch (error) {
    console.error('Writing assessment error:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to assess writing' }
    });
  }
}

export default authMiddleware(handler);
