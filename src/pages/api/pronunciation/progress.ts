import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { PronunciationProgress } from '@/services/api/pronunciationApiService';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { getUserId } from '@/utils/auth';

interface PronunciationPracticeRow {
  exercise_id: string;
  score: number | null;
  created_at: string;
}

function toPhraseId(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PronunciationProgress[] | PronunciationProgress>>
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }

  try {
    const db = supabaseAdmin ?? supabase;
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    if (req.method === 'GET') {
      const { data, error } = await db
        .from(TABLES.PRONUNCIATION_PRACTICE_ITEMS)
        .select('exercise_id,score,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch pronunciation progress: ${error.message}`);
      }

      const rows = (data || []) as PronunciationPracticeRow[];
      const byExercise = new Map<string, PronunciationProgress>();

      rows.forEach((row) => {
        const key = row.exercise_id;
        const score = Number(row.score || 0);

        if (!byExercise.has(key)) {
          byExercise.set(key, {
            phraseId: key,
            bestAccuracy: score,
            attempts: 1,
            lastAttempt: row.created_at
          });
          return;
        }

        const current = byExercise.get(key)!;
        current.bestAccuracy = Math.max(current.bestAccuracy, score);
        current.attempts += 1;
        if (new Date(row.created_at).getTime() > new Date(current.lastAttempt).getTime()) {
          current.lastAttempt = row.created_at;
        }
      });

      return res.status(200).json({
        success: true,
        data: Array.from(byExercise.values()),
        progress: Array.from(byExercise.values())
      });
    }

    const { phraseId: rawPhraseId, accuracy, transcript, feedback } = req.body as {
      phraseId?: string | number;
      accuracy?: number;
      transcript?: string;
      feedback?: unknown;
    };

    const phraseId = toPhraseId(rawPhraseId);
    const numericAccuracy = Number(accuracy);

    if (!phraseId || !Number.isFinite(numericAccuracy)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid phraseId or accuracy' }
      });
    }

    const { data: exercise, error: exerciseError } = await db
      .from(TABLES.PRONUNCIATION_EXERCISES)
      .select('id')
      .eq('id', phraseId)
      .single();

    if (exerciseError || !exercise) {
      return res.status(404).json({
        success: false,
        error: { message: 'Pronunciation exercise not found' }
      });
    }

    const { error: insertError } = await db
      .from(TABLES.PRONUNCIATION_PRACTICE_ITEMS)
      .insert({
        user_id: userId,
        exercise_id: phraseId,
        score: numericAccuracy,
        transcript: transcript || null,
        feedback: feedback ?? null
      });

    if (insertError) {
      throw new Error(`Failed to update pronunciation progress: ${insertError.message}`);
    }

    const { data: statsRows, error: statsError } = await db
      .from(TABLES.PRONUNCIATION_PRACTICE_ITEMS)
      .select('score,created_at')
      .eq('user_id', userId)
      .eq('exercise_id', phraseId)
      .order('created_at', { ascending: false });

    if (statsError) {
      throw new Error(`Failed to read updated pronunciation progress: ${statsError.message}`);
    }

    const rows = statsRows || [];
    const bestAccuracy = rows.reduce((max, row) => Math.max(max, Number(row.score || 0)), 0);
    const lastAttempt = rows[0]?.created_at || new Date().toISOString();

    const progress = {
      phraseId,
      bestAccuracy,
      attempts: rows.length,
      lastAttempt
    };

    return res.status(200).json({
      success: true,
      data: progress,
      progress
    });
  } catch (error) {
    console.error('Error in pronunciation progress API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
