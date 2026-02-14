import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';

const cefrLevels = {
  A1: 'Beginner - Can understand and use familiar everyday expressions and very basic phrases.',
  A2: 'Elementary - Can communicate in simple and routine tasks requiring a simple and direct exchange of information.',
  B1: 'Intermediate - Can deal with most situations likely to arise while traveling in an area where the language is spoken.',
  B2: 'Upper Intermediate - Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers possible.',
  C1: 'Advanced - Can express ideas fluently and spontaneously without much obvious searching for expressions.',
  C2: 'Proficient - Can understand with ease virtually everything heard or read.'
};

type AssessmentInput = {
  score?: number;
  area?: 'grammar' | 'vocabulary' | 'listening' | 'reading' | 'speaking';
  correct?: boolean;
};

function computeScore(responses: AssessmentInput[]): number {
  if (responses.length === 0) return 0;

  let total = 0;
  responses.forEach((response) => {
    if (typeof response.score === 'number' && Number.isFinite(response.score)) {
      total += Math.max(0, Math.min(100, response.score));
      return;
    }

    if (typeof response.correct === 'boolean') {
      total += response.correct ? 100 : 0;
      return;
    }

    total += 50;
  });

  return Math.round(total / responses.length);
}

function scoreToLevel(score: number): keyof typeof cefrLevels {
  if (score < 30) return 'A1';
  if (score < 45) return 'A2';
  if (score < 60) return 'B1';
  if (score < 75) return 'B2';
  if (score < 90) return 'C1';
  return 'C2';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await isAuthenticated(req))) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { responses } = req.body as { responses?: AssessmentInput[] };

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ message: 'Valid assessment responses are required' });
    }

    const score = computeScore(responses);
    const level = scoreToLevel(score);

    const detailedResults = {
      grammar: Math.max(0, Math.min(100, score - 5)),
      vocabulary: Math.max(0, Math.min(100, score + 3)),
      listening: Math.max(0, Math.min(100, score - 2)),
      reading: Math.max(0, Math.min(100, score + 2)),
      speaking: Math.max(0, Math.min(100, score - 1))
    };

    const areaScores = Object.entries(detailedResults)
      .map(([area, value]) => ({ area, value }))
      .sort((a, b) => a.value - b.value);

    const weaknesses = areaScores.slice(0, 2).map((item) => item.area);
    const strengths = areaScores.slice(-2).map((item) => item.area);

    const db = supabaseAdmin ?? supabase;
    await db.from(TABLES.PRACTICE_SESSIONS).insert({
      user_id: userId,
      type: 'assessment',
      score,
      items: {
        responses,
        level,
        detailedResults
      }
    });

    return res.status(200).json({
      score,
      level,
      levelDescription: cefrLevels[level],
      assessment: {
        weaknesses,
        strengths,
        recommendedFocus: weaknesses,
        detailedResults
      }
    });
  } catch (error) {
    console.error('Assessment error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
