import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { supabase, TABLES } from '@/lib/supabase';
import { getUserId } from '@/utils/auth';

interface GrammarProgress {
  exerciseId: number;
  bestScore: number;
  attempts: number;
  lastAttempt: string;
}

interface PracticeItemRow {
  content: {
    exerciseId?: number | string;
  } | null;
  score: number | null;
  created_at: string;
}

function normalizeExerciseId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GrammarProgress[] | GrammarProgress>>
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from(TABLES.PRACTICE_ITEMS)
        .select('content,score,created_at')
        .eq('user_id', userId)
        .eq('type', 'grammar')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch grammar progress: ${error.message}`);
      }

      const rows = (data || []) as PracticeItemRow[];
      const byExercise = new Map<number, GrammarProgress>();

      rows.forEach((row) => {
        const exerciseId = normalizeExerciseId(row.content?.exerciseId);
        if (!exerciseId) return;

        const rowScore = Number(row.score || 0);

        if (!byExercise.has(exerciseId)) {
          byExercise.set(exerciseId, {
            exerciseId,
            bestScore: rowScore,
            attempts: 1,
            lastAttempt: row.created_at
          });
          return;
        }

        const existing = byExercise.get(exerciseId)!;
        existing.bestScore = Math.max(existing.bestScore, rowScore);
        existing.attempts += 1;
        if (new Date(row.created_at).getTime() > new Date(existing.lastAttempt).getTime()) {
          existing.lastAttempt = row.created_at;
        }
      });

      return res.status(200).json({
        success: true,
        data: Array.from(byExercise.values())
      });
    }

    const { exerciseId: rawExerciseId, score } = req.body as { exerciseId?: number | string; score?: number };
    const exerciseId = normalizeExerciseId(rawExerciseId);
    const numericScore = Number(score);

    if (!exerciseId || !Number.isFinite(numericScore)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid exerciseId or score'
        }
      });
    }

    const { error: insertError } = await supabase
      .from(TABLES.PRACTICE_ITEMS)
      .insert({
        user_id: userId,
        type: 'grammar',
        content: { exerciseId },
        score: numericScore,
        completed: true
      });

    if (insertError) {
      throw new Error(`Failed to update grammar progress: ${insertError.message}`);
    }

    const { data: rows, error: rowsError } = await supabase
      .from(TABLES.PRACTICE_ITEMS)
      .select('score,created_at')
      .eq('user_id', userId)
      .eq('type', 'grammar')
      .contains('content', { exerciseId })
      .order('created_at', { ascending: false });

    if (rowsError) {
      throw new Error(`Failed to fetch updated grammar progress: ${rowsError.message}`);
    }

    const attempts = rows?.length || 0;
    const bestScore = (rows || []).reduce((max, row) => Math.max(max, Number(row.score || 0)), 0);
    const lastAttempt = rows?.[0]?.created_at || new Date().toISOString();

    return res.status(200).json({
      success: true,
      data: {
        exerciseId,
        bestScore,
        attempts,
        lastAttempt
      }
    });
  } catch (error) {
    console.error('Error in grammar progress API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
