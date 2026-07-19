import type { NextApiResponse } from 'next';
import { getOpenAIClient, safeJSONParse } from '@/utils/openaiClient';
import { authMiddleware } from '@/utils/authMiddleware';
import { AuthenticatedRequest } from '@/types/api';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { getOrCreateUserProfile } from '@/utils/userProfile';
import { recordActivity, updateUserXpAndStreak } from '@/utils/progressTracker';
import { isCefrLevel } from '@/lib/curriculum';

const DRILLABLE_AREAS = ['grammar', 'vocabulary', 'listening', 'conversation', 'pronunciation', 'reading', 'writing'];

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, error: { message: 'User not authenticated' } });
  }

  const db = supabaseAdmin ?? supabase;

  // Record a completed drill so future plans and skill charts see it
  if (req.method === 'PUT') {
    const { area, score } = req.body as { area?: string; score?: number };
    if (!area || !DRILLABLE_AREAS.includes(area) || typeof score !== 'number') {
      return res.status(400).json({ success: false, error: { message: 'Valid area and score are required' } });
    }
    await recordActivity(db as never, userId, area as never, score, { source: 'weak-point-drill' });
    await updateUserXpAndStreak(db as never, userId, score >= 60 ? 10 : 5);
    return res.status(200).json({ success: true, data: { recorded: true } });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { data: user } = await getOrCreateUserProfile(userId);
    const level = isCefrLevel(user?.level) ? user!.level : 'A1';

    // Find weak areas from recent practice and exam history
    const [sessionResult, examResult] = await Promise.all([
      db
        .from(TABLES.PRACTICE_SESSIONS)
        .select('type, score')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30),
      db
        .from(TABLES.EXAM_RESULTS)
        .select('module, percentage')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(10)
    ]);

    const scoresByArea = new Map<string, number[]>();
    const addScore = (area: string, score: number) => {
      const list = scoresByArea.get(area) ?? [];
      list.push(score);
      scoresByArea.set(area, list);
    };
    for (const session of (sessionResult.data || []) as Array<{ type: string; score: number | null }>) {
      if (typeof session.score === 'number' && DRILLABLE_AREAS.includes(session.type)) {
        addScore(session.type, session.score);
      }
    }
    for (const exam of (examResult.data || []) as Array<{ module: string; percentage: number | null }>) {
      if (typeof exam.percentage === 'number' && DRILLABLE_AREAS.includes(exam.module)) {
        addScore(exam.module, exam.percentage);
      }
    }

    const averages = Array.from(scoresByArea.entries())
      .map(([area, scores]) => ({
        area,
        average: scores.reduce((sum, s) => sum + s, 0) / scores.length
      }))
      .sort((a, b) => a.average - b.average);

    const weakAreas = averages.slice(0, 2).map((entry) => entry.area);
    const targetAreas = weakAreas.length > 0 ? weakAreas : ['grammar', 'vocabulary'];
    const recentAccuracy = averages.length > 0 ? Math.round(averages[0].average) : null;

    // Adaptive difficulty: aim slightly above the learner's demonstrated accuracy
    const difficultyInstruction =
      recentAccuracy === null
        ? `Pitch the difficulty at a standard ${level} level.`
        : recentAccuracy < 40
          ? `The learner is struggling (recent accuracy ~${recentAccuracy}%). Make the exercises slightly easier than typical ${level}, focusing on fundamentals.`
          : recentAccuracy > 80
            ? `The learner is doing well (recent accuracy ~${recentAccuracy}%). Make the exercises slightly harder than typical ${level} to stretch them.`
            : `Pitch the difficulty at a standard ${level} level (recent accuracy ~${recentAccuracy}%).`;

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a French tutor generating a targeted drill. Create exactly 5 multiple-choice exercises for a ${level} learner, focused on: ${targetAreas.join(' and ')}. ${difficultyInstruction}

Respond with ONLY a JSON object:
{
  "exercises": [
    {
      "question": "the exercise prompt (French content, English instructions where helpful)",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "why the answer is right, briefly",
      "area": "${targetAreas[0]}"
    }
  ]
}

Each exercise's "area" must be one of: ${targetAreas.join(', ')}. Vary the question formats (fill-the-blank, choose-the-correct-form, best-translation, odd-one-out).`
        },
        {
          role: 'user',
          content: `Generate the drill now.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1600,
      response_format: { type: 'json_object' }
    });

    const parsed = safeJSONParse(response.choices[0].message.content || '{}');
    const exercises = Array.isArray(parsed.exercises) ? parsed.exercises : [];

    if (exercises.length === 0) {
      return res.status(502).json({ success: false, error: { message: 'Could not generate exercises. Please try again.' } });
    }

    return res.status(200).json({
      success: true,
      data: { level, weakAreas: targetAreas, recentAccuracy, exercises }
    });
  } catch (error) {
    console.error('Weak-point drill error:', error);
    return res.status(500).json({ success: false, error: { message: 'Failed to generate drill' } });
  }
}

export default authMiddleware(handler);
