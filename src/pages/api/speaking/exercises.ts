import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { authMiddleware } from '../../../utils/authMiddleware';
import { supabase, TABLES } from '@/lib/supabase';

// Define the speaking exercise type
interface SpeakingExercise {
  id: string;
  prompt: string;
  translation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category?: 'greetings' | 'travel' | 'dining' | 'everyday' | 'business' | 'shopping';
}

// Define the feedback type for speaking evaluation
interface SpeakingFeedback {
  accuracy: number;
  pronunciation: number;
  fluency: number;
  feedback: string;
  type: 'success' | 'warning' | 'error';
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SpeakingExercise[] | SpeakingExercise | SpeakingFeedback>>
) {
  // GET request to retrieve speaking exercises
  if (req.method === 'GET') {
    try {
      const { id, difficulty, category } = req.query;

      // If ID is provided, return that specific exercise
      if (id) {
        const exerciseId = id as string;
        const { data: dbExercise, error } = await supabase
          .from(TABLES.PRONUNCIATION_EXERCISES)
          .select('*')
          .eq('id', exerciseId)
          .single();

        if (error || !dbExercise) {
          return res.status(404).json({
            success: false,
            error: { message: 'Exercise not found' }
          });
        }

        // Transform to speaking exercise format
        const exercise: SpeakingExercise = {
          id: dbExercise.id,
          prompt: dbExercise.text,
          translation: dbExercise.translation || '',
          difficulty: mapDifficultyLevel(dbExercise.difficulty),
          category: mapCategory(dbExercise.category)
        };

        return res.status(200).json({
          success: true,
          data: exercise
        });
      }



      // Get exercises from database
      let query = supabase
        .from(TABLES.PRONUNCIATION_EXERCISES)
        .select('*')
        .order('id', { ascending: true });

      // Apply filters
      if (difficulty) {
        const dbDifficulty = mapDifficultyToDb(difficulty as string);
        if (dbDifficulty) {
          query = query.eq('difficulty', dbDifficulty);
        }
      }

      if (category) {
        query = query.eq('category', category);
      }

      const { data: dbExercises, error } = await query;

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      // Transform to speaking exercise format
      interface DatabaseSpeakingExercise {
        id: string;
        text: string;
        translation?: string;
        difficulty: string;
        category?: string;
      }
      const exercises: SpeakingExercise[] = (dbExercises || []).map((exercise: DatabaseSpeakingExercise) => ({
        id: exercise.id,
        prompt: exercise.text,
        translation: exercise.translation || '',
        difficulty: mapDifficultyLevel(exercise.difficulty),
        category: mapCategory(exercise.category || null)
      }));

      return res.status(200).json({
        success: true,
        data: exercises
      });
    } catch (error) {
      console.error('Error fetching speaking exercises:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  // POST request to evaluate speaking
  if (req.method === 'POST') {
    try {
      const { exerciseId, transcript } = req.body;

      // Validate required fields
      if (!exerciseId || !transcript) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required fields' }
        });
      }

      // Find the exercise in database
      const { data: dbExercise, error } = await supabase
        .from(TABLES.PRONUNCIATION_EXERCISES)
        .select('*')
        .eq('id', exerciseId)
        .single();

      if (error || !dbExercise) {
        return res.status(404).json({
          success: false,
          error: { message: 'Exercise not found' }
        });
      }

      const feedback: SpeakingFeedback = generateSpeakingFeedback(transcript, dbExercise);

      return res.status(200).json({
        success: true,
        data: feedback
      });
    } catch (error) {
      console.error('Error evaluating speaking:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: { message: 'Method not allowed' }
  });
}

// Helper functions
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

function mapDifficultyToDb(difficulty: string): string | null {
  switch (difficulty) {
    case 'beginner':
      return 'A1';
    case 'intermediate':
      return 'B1';
    case 'advanced':
      return 'C1';
    default:
      return null;
  }
}

function mapCategory(dbCategory: string | null): 'greetings' | 'travel' | 'dining' | 'everyday' | 'business' | 'shopping' | undefined {
  if (!dbCategory) return undefined;

  const validCategories = ['greetings', 'travel', 'dining', 'everyday', 'business', 'shopping'];
  return validCategories.includes(dbCategory) ? dbCategory as 'greetings' | 'travel' | 'dining' | 'everyday' | 'business' | 'shopping' : 'everyday';
}

function generateSpeakingFeedback(transcript: string, exercise: { text: string }): SpeakingFeedback {
  const normalizedTranscript = normalizeText(transcript);
  const normalizedExpected = normalizeText(exercise.text);

  const editDistance = levenshteinDistance(normalizedTranscript, normalizedExpected);
  const maxLength = Math.max(normalizedTranscript.length, normalizedExpected.length, 1);
  const stringSimilarity = 1 - editDistance / maxLength;

  const transcriptWords = normalizedTranscript.split(' ').filter(Boolean);
  const expectedWords = normalizedExpected.split(' ').filter(Boolean);
  const expectedSet = new Set(expectedWords);
  const matchedWords = transcriptWords.filter((word) => expectedSet.has(word)).length;
  const wordCoverage = expectedWords.length > 0 ? matchedWords / expectedWords.length : 0;

  const accuracy = Math.round(Math.min(100, Math.max(0, (stringSimilarity * 0.6 + wordCoverage * 0.4) * 100)));
  const pronunciation = Math.round(Math.min(100, Math.max(0, accuracy - 5)));
  const fluency = Math.round(Math.min(100, Math.max(0, accuracy - Math.abs(transcriptWords.length - expectedWords.length) * 2)));

  let feedback = '';
  let type: 'success' | 'warning' | 'error' = 'error';

  if (accuracy > 80) {
    feedback = 'Excellent pronunciation! Your accent is very natural.';
    type = 'success';
  } else if (accuracy > 60) {
    feedback = 'Good attempt! Try to focus on the "r" sound in French.';
    type = 'warning';
  } else {
    feedback = 'Try again. Pay attention to the pronunciation of vowels.';
    type = 'error';
  }

  return {
    accuracy,
    pronunciation,
    fluency,
    feedback,
    type
  };
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9À-ÿ\s']/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

export default authMiddleware(handler);
