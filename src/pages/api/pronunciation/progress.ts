import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { PronunciationProgress } from '@/services/api/pronunciationApiService';
import { supabase, TABLES } from '@/lib/supabase';
import { getUserId } from '@/utils/auth';

// Mock pronunciation progress data
const mockPronunciationProgress: PronunciationProgress[] = [
  {
    phraseId: 1,
    bestAccuracy: 85,
    attempts: 5,
    lastAttempt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    phraseId: 2,
    bestAccuracy: 92,
    attempts: 3,
    lastAttempt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    phraseId: 3,
    bestAccuracy: 78,
    attempts: 4,
    lastAttempt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    phraseId: 4,
    bestAccuracy: 65,
    attempts: 2,
    lastAttempt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PronunciationProgress[] | PronunciationProgress>>
) {
  const toPhraseId = (value: unknown): string | number | null => {
    if (typeof value === 'string' && value.trim().length > 0) return value;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    return null;
  };

  // Handle GET request to retrieve progress
  if (req.method === 'GET') {
    try {
      const userId = await getUserId(req);
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' }
        });
      }

      // Get pronunciation progress from database
      const { data: progressData, error } = await supabase
        .from(TABLES.PRONUNCIATION_PRACTICE_ITEMS)
        .select(`
          exercise_id,
          best_accuracy,
          attempts,
          last_practiced,
          pronunciation_exercises!inner(id, text)
        `)
        .eq('user_id', userId)
        .order('last_practiced', { ascending: false });

      if (error) {
        console.error('Error fetching pronunciation progress:', error);
        return res.status(500).json({
          success: false,
          error: { message: 'Failed to fetch pronunciation progress' }
        });
      }

      // Transform database data to API format
      const pronunciationProgress: PronunciationProgress[] = (progressData || []).map(item => ({
        phraseId: item.exercise_id,
        bestAccuracy: item.best_accuracy || 0,
        attempts: item.attempts || 0,
        lastAttempt: item.last_practiced || new Date().toISOString()
      }));

      // If no progress data exists, return empty array
      if (pronunciationProgress.length === 0) {
        return res.status(200).json({
          success: true,
          data: []
        });
      }

      return res.status(200).json({
        success: true,
        data: pronunciationProgress ?? mockPronunciationProgress
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

  // Handle POST request to update progress
  if (req.method === 'POST') {
    try {
      const userId = await getUserId(req);
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' }
        });
      }

      const { phraseId: rawPhraseId, accuracy } = req.body;
      const phraseId = toPhraseId(rawPhraseId);
      const numericAccuracy = Number(accuracy);

      // Validate input
      if (!phraseId || !Number.isFinite(numericAccuracy)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid phraseId or accuracy'
          }
        });
      }

      // Check if exercise exists
      const { data: exercise, error: exerciseError } = await supabase
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

      // Check if progress already exists for this user and exercise
      const { data: existingProgress, error: fetchError } = await supabase
        .from(TABLES.PRONUNCIATION_PRACTICE_ITEMS)
        .select('*')
        .eq('user_id', userId)
        .eq('exercise_id', phraseId)
        .single();

      let updatedProgress: PronunciationProgress;

      if (existingProgress && !fetchError) {
        // Update existing progress
        const newBestAccuracy = Math.max(existingProgress.best_accuracy || 0, numericAccuracy);
        const newAttempts = (existingProgress.attempts || 0) + 1;

        const { data: updated, error: updateError } = await supabase
          .from(TABLES.PRONUNCIATION_PRACTICE_ITEMS)
          .update({
            best_accuracy: newBestAccuracy,
            attempts: newAttempts,
            last_practiced: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('exercise_id', phraseId)
          .select()
          .single();

        if (updateError) {
          throw new Error(`Failed to update progress: ${updateError.message}`);
        }

        updatedProgress = {
          phraseId: updated.exercise_id,
          bestAccuracy: updated.best_accuracy,
          attempts: updated.attempts,
          lastAttempt: updated.last_practiced
        };
      } else {
        // Create new progress entry
        const { data: created, error: createError } = await supabase
          .from(TABLES.PRONUNCIATION_PRACTICE_ITEMS)
          .insert({
            user_id: userId,
            exercise_id: phraseId,
            best_accuracy: numericAccuracy,
            attempts: 1,
            last_practiced: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          throw new Error(`Failed to create progress: ${createError.message}`);
        }

        updatedProgress = {
          phraseId: created.exercise_id,
          bestAccuracy: created.best_accuracy,
          attempts: created.attempts,
          lastAttempt: created.last_practiced
        };
      }

      // Return the updated progress
      return res.status(200).json({
        success: true,
        data: updatedProgress
      });
    } catch (error) {
      console.error('Error updating pronunciation progress:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }
  
  // Handle other HTTP methods
  return res.status(405).json({
    success: false,
    error: {
      message: 'Method not allowed'
    }
  });
}
