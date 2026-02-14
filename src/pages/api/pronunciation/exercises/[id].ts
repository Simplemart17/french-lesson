import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { PronunciationExercise as ImportedPronunciationExercise } from '@/services/api/pronunciationApiService';
import { supabase, TABLES } from '@/lib/supabase';

interface PronunciationPhrase {
  id: string;
  text: string;
  translation: string;
  audioUrl: string;
  phonetics: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusSounds: string[];
}

interface PronunciationExercise extends ImportedPronunciationExercise {
  id: number;
  phrases: PronunciationPhrase[];
}

interface DatabasePronunciationExercise {
  id: string;
  text: string;
  translation: string | null;
  level: string;
  category: string | null;
  expected_pronunciation: string | null;
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

function buildExerciseObjects(rows: DatabasePronunciationExercise[]): PronunciationExercise[] {
  const groups: Record<string, PronunciationPhrase[]> = {};

  rows.forEach((row) => {
    const difficulty = mapDifficultyLevel(row.level);

    if (!groups[difficulty]) {
      groups[difficulty] = [];
    }

    groups[difficulty].push({
      id: row.id,
      text: row.text,
      translation: row.translation || '',
      difficulty,
      audioUrl: `/api/tts?text=${encodeURIComponent(row.text)}&lang=fr`,
      phonetics: row.expected_pronunciation || '',
      focusSounds: row.category ? row.category.split(',').map((part) => part.trim()).filter(Boolean) : []
    });
  });

  const order: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner', 'intermediate', 'advanced'];
  const exercises: PronunciationExercise[] = [];
  let id = 1;

  order.forEach((difficulty) => {
    const phrases = groups[difficulty] || [];

    for (let i = 0; i < phrases.length; i += 4) {
      const chunk = phrases.slice(i, i + 4);
      if (chunk.length === 0) continue;

      exercises.push({
        id: id++,
        title: `${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)} Pronunciation Practice`,
        description: `Practice French pronunciation with ${difficulty} level phrases.`,
        difficulty,
        phrases: chunk,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  });

  return exercises;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PronunciationExercise>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }

  try {
    const { id } = req.query;
    const exerciseId = parseInt(id as string, 10);

    if (!Number.isFinite(exerciseId) || exerciseId <= 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid exercise ID' }
      });
    }

    const { data, error } = await supabase
      .from(TABLES.PRONUNCIATION_EXERCISES)
      .select('id,text,translation,level,category,expected_pronunciation')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    const exercises = buildExerciseObjects((data || []) as DatabasePronunciationExercise[]);
    const exercise = exercises.find((item) => item.id === exerciseId);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: { message: `Pronunciation exercise with ID ${exerciseId} not found` }
      });
    }

    return res.status(200).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Error in pronunciation exercise API:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
}
