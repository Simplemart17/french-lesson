import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import {
  PronunciationExercise as ImportedPronunciationExercise,
  PronunciationPhrase as ImportedPronunciationPhrase
} from '@/services/api/pronunciationApiService';
import { supabase, TABLES } from '@/lib/supabase';

interface PronunciationPhrase extends ImportedPronunciationPhrase {
  audioUrl: string;
  phonetics: string;
  focusSounds: string[];
}

interface PronunciationExercise extends ImportedPronunciationExercise {
  id: number;
  phrases: PronunciationPhrase[];
}

interface CustomPronunciationExerciseListResponse {
  items: PronunciationExercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface DatabasePronunciationExercise {
  id: string;
  text: string;
  translation: string | null;
  level: string;
  category: string | null;
  expected_pronunciation: string | null;
  created_at: string;
  updated_at: string;
}

function mapDifficultyLevel(level: string): 'beginner' | 'intermediate' | 'advanced' {
  switch (level) {
    case 'A1':
    case 'A2':
      return 'beginner';
    case 'B1':
    case 'B2':
      return 'intermediate';
    case 'C1':
    case 'C2':
      return 'advanced';
    default:
      return 'beginner';
  }
}

function mapDifficultyToDbLevels(
  difficulty: string
): Array<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'> {
  switch (difficulty) {
    case 'beginner':
      return ['A1', 'A2'];
    case 'intermediate':
      return ['B1', 'B2'];
    case 'advanced':
      return ['C1', 'C2'];
    case 'A1':
    case 'A2':
    case 'B1':
    case 'B2':
    case 'C1':
    case 'C2':
      return [difficulty];
    default:
      return ['A1', 'A2'];
  }
}

function buildExerciseObjects(rows: DatabasePronunciationExercise[]): PronunciationExercise[] {
  const exerciseGroups: Record<string, PronunciationPhrase[]> = {};

  rows.forEach((exercise) => {
    const difficulty = mapDifficultyLevel(exercise.level);

    if (!exerciseGroups[difficulty]) {
      exerciseGroups[difficulty] = [];
    }

    const focusSounds = exercise.category
      ? exercise.category.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

    exerciseGroups[difficulty].push({
      id: exercise.id,
      text: exercise.text,
      translation: exercise.translation || '',
      difficulty,
      phonetics: exercise.expected_pronunciation || '',
      focusSounds,
      audioUrl: `/api/tts?text=${encodeURIComponent(exercise.text)}&lang=fr`
    });
  });

  const order: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner', 'intermediate', 'advanced'];
  const exerciseObjects: PronunciationExercise[] = [];
  let exerciseId = 1;

  order.forEach((difficulty) => {
    const phrases = exerciseGroups[difficulty] || [];

    for (let i = 0; i < phrases.length; i += 4) {
      const exercisePhrases = phrases.slice(i, i + 4);
      if (exercisePhrases.length === 0) continue;

      exerciseObjects.push({
        id: exerciseId++,
        title: `${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)} Pronunciation Practice`,
        description: `Practice French pronunciation with ${difficulty} level phrases.`,
        difficulty,
        phrases: exercisePhrases,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  });

  return exerciseObjects;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CustomPronunciationExerciseListResponse>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }

  try {
    const { difficulty, search, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const safePage = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
    const safeLimit = Number.isFinite(limitNum) && limitNum > 0 ? limitNum : 10;
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit;

    let query = supabase
      .from(TABLES.PRONUNCIATION_EXERCISES)
      .select('id,text,translation,level,category,expected_pronunciation,created_at,updated_at')
      .order('created_at', { ascending: true });

    if (difficulty && typeof difficulty === 'string') {
      query = query.in('level', mapDifficultyToDbLevels(difficulty));
    }

    if (search && typeof search === 'string') {
      query = query.or(`text.ilike.%${search}%,translation.ilike.%${search}%,category.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    const rows = (data || []) as DatabasePronunciationExercise[];
    const exerciseObjects = buildExerciseObjects(rows);
    const paginatedExercises = exerciseObjects.slice(from, to);

    const payload = {
      items: paginatedExercises,
      total: exerciseObjects.length,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(exerciseObjects.length / safeLimit)
    };

    return res.status(200).json({
      success: true,
      data: payload,
      exercises: payload
    });
  } catch (error) {
    console.error('Error in pronunciation exercises API:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
}

export default handler;
