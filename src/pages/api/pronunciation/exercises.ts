import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { PronunciationExercise as ImportedPronunciationExercise, PronunciationPhrase as ImportedPronunciationPhrase } from '@/services/api/pronunciationApiService';
import { getSupabaseClient, TABLES } from '@/lib/supabase';

// Extended PronunciationPhrase interface for the mock data
interface PronunciationPhrase extends ImportedPronunciationPhrase {
  audioUrl: string;
  phonetics: string;
  focusSounds: string[];
}

// Extended PronunciationExercise interface for the mock data
interface PronunciationExercise extends ImportedPronunciationExercise {
  phrases: PronunciationPhrase[];
}

// Define a custom response type that uses our local PronunciationExercise type
interface CustomPronunciationExerciseListResponse {
  items: PronunciationExercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CustomPronunciationExerciseListResponse>>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }

  try {
    // Get query parameters
    const { difficulty, search, page = '1', limit = '10' } = req.query;

    // Get Supabase client
    const supabase = getSupabaseClient();

    // Calculate pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    // Build query
    let query = supabase
      .from(TABLES.PRONUNCIATION_EXERCISES)
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(from, to);

    // Apply filters
    if (difficulty) {
      query = query.eq('difficulty', difficulty as string);
    }

    if (search && typeof search === 'string') {
      query = query.or(`text.ilike.%${search}%,translation.ilike.%${search}%`);
    }

    const { data: exercises, error, count } = await query;

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    const total = count || 0;

    // Group exercises by difficulty and create exercise objects
    const exerciseGroups: { [key: string]: any[] } = {};

    (exercises || []).forEach((exercise: any) => {
      const difficulty = mapDifficultyLevel(exercise.difficulty);
      if (!exerciseGroups[difficulty]) {
        exerciseGroups[difficulty] = [];
      }
      exerciseGroups[difficulty].push({
        id: exercise.id,
        text: exercise.text,
        translation: exercise.translation || '',
        audioUrl: `/api/tts?text=${encodeURIComponent(exercise.text)}&lang=fr`,
        phonetics: exercise.expectedPronunciation || '',
        focusSounds: []
      });
    });

    // Create exercise objects
    const exerciseObjects: PronunciationExercise[] = [];
    let exerciseId = 1;

    Object.entries(exerciseGroups).forEach(([difficulty, phrases]) => {
      if (phrases.length > 0) {
        // Group phrases into exercises of 3-5 phrases each
        for (let i = 0; i < phrases.length; i += 4) {
          const exercisePhrases = phrases.slice(i, i + 4);
          exerciseObjects.push({
            id: exerciseId++,
            title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Pronunciation Practice`,
            description: `Practice French pronunciation with ${difficulty} level phrases.`,
            difficulty: difficulty as any,
            phrases: exercisePhrases,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    });

    // Apply pagination to exercise objects
    const paginatedExercises = exerciseObjects.slice(0, limitNum);

    // Prepare response
    const response: CustomPronunciationExerciseListResponse = {
      items: paginatedExercises,
      total: exerciseObjects.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(exerciseObjects.length / limitNum)
    };

    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error in pronunciation exercises API:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
}

// Helper function to map database difficulty to API difficulty
function mapDifficultyLevel(dbDifficulty: string): 'beginner' | 'intermediate' | 'advanced' {
  switch (dbDifficulty) {
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

export default handler;
