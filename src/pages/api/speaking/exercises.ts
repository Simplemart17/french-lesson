import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { authMiddleware } from '../../../utils/authMiddleware';
import { getSupabaseClient, TABLES } from '@/lib/supabase';

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

        // Get exercise from database
        const supabase = getSupabaseClient();
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
      const supabase = getSupabaseClient();
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
      const exercises: SpeakingExercise[] = (dbExercises || []).map((exercise: any) => ({
        id: exercise.id,
        prompt: exercise.text,
        translation: exercise.translation || '',
        difficulty: mapDifficultyLevel(exercise.difficulty),
        category: mapCategory(exercise.category)
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
      const supabase = getSupabaseClient();
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

      // In a real app, this would use a speech recognition API to evaluate the pronunciation
      // For now, we'll simulate feedback based on the transcript and expected pronunciation

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
  return validCategories.includes(dbCategory) ? dbCategory as any : 'everyday';
}

function generateSpeakingFeedback(transcript: string, exercise: any): SpeakingFeedback {
  // Simple feedback generation based on transcript quality
  const transcriptLength = transcript.length;
  const expectedLength = exercise.text.length;
  const lengthRatio = transcriptLength / expectedLength;

  let accuracy = Math.min(100, Math.max(0, lengthRatio * 80 + Math.random() * 20));
  let pronunciation = Math.min(100, Math.max(0, 70 + Math.random() * 30));
  let fluency = Math.min(100, Math.max(0, 60 + Math.random() * 40));

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
    accuracy: Math.round(accuracy),
    pronunciation: Math.round(pronunciation),
    fluency: Math.round(fluency),
    feedback,
    type
  };
}

export default authMiddleware(handler);
