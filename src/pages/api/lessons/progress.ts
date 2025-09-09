import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, LessonProgress } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';
import { getUserId } from '@/utils/auth';
import { supabase, TABLES } from '@/lib/supabase';

async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<LessonProgress | LessonProgress[]>>) {
  // Handle GET request
  if (req.method === 'GET') {
    try {
      // Get user ID from authenticated user
      const userId = await getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' }
        });
      }

      // Get lessonId from query if provided
      const { lessonId } = req.query;

      // Get progress from database
      let supabaseQuery = supabase
        .from(TABLES.LESSON_PROGRESS)
        .select('*')
        .eq('user_id', userId)
        .order('lesson_id', { ascending: true });

      // Add lessonId filter if provided
      if (lessonId) {
        supabaseQuery = supabaseQuery.eq('lesson_id', lessonId as string);
      }

      const { data: progress, error } = await supabaseQuery;

      if (error) {
        console.error('Error fetching lesson progress:', error);
        return res.status(500).json({
          success: false,
          error: { message: 'Failed to fetch lesson progress' }
        });
      }

      // Format the data for the response
      type DBLessonProgress = {
        id: string;
        user_id: string;
        lesson_id: string;
        completed: boolean;
        score: number;
        started_at: string;
        completed_at?: string | null;
        answers?: Record<string, string | string[]> | undefined;
      };

      const formattedProgress = (progress || []).map((item: DBLessonProgress) => ({
        id: item.id,
        userId: item.user_id,
        lessonId: item.lesson_id,
        completed: item.completed,
        score: item.score,
        startedAt: item.started_at,
        completedAt: item.completed_at || null,
        answers: item.answers
      }));

      return res.status(200).json({
        success: true,
        data: formattedProgress
      });
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch lesson progress' }
      });
    }
  }

  // Handle POST request (update progress)
  if (req.method === 'POST') {
    try {
      const { lessonId, completed, score, answers } = req.body;

      if (!lessonId || typeof lessonId !== 'string') {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid or missing lessonId' }
        });
      }

      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid or missing completed status' }
        });
      }

      if (typeof score !== 'number' || score < 0 || score > 100) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid score (must be a number between 0 and 100)' }
        });
      }

      // Get user ID from authenticated user
      const userId = await getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' }
        });
      }

      // Check if lesson exists
      const { data: lesson, error: lessonError } = await supabase
        .from(TABLES.LESSONS)
        .select('id')
        .eq('id', lessonId)
        .single();

      if (lessonError || !lesson) {
        return res.status(404).json({
          success: false,
          error: { message: 'Lesson not found' }
        });
      }

      // Get current timestamp
      const now = new Date();

      // Update or create progress (Supabase upsert)
      const progressData = {
        user_id: userId,
        lesson_id: lessonId,
        completed,
        score,
        started_at: now.toISOString(),
        completed_at: completed ? now.toISOString() : null,
        answers: answers || null
      };

      const { data: updatedProgress, error: upsertError } = await supabase
        .from(TABLES.LESSON_PROGRESS)
        .upsert(progressData, {
          onConflict: 'user_id,lesson_id'
        })
        .select()
        .single();

      if (upsertError) {
        console.error('Error updating lesson progress:', upsertError);
        return res.status(500).json({
          success: false,
          error: { message: 'Failed to update lesson progress' }
        });
      }

      // Format the data for the response
      const formattedProgress: LessonProgress = {
        id: updatedProgress.id,
        userId: updatedProgress.user_id,
        lessonId: updatedProgress.lesson_id,
        completed: updatedProgress.completed,
        score: updatedProgress.score,
        startedAt: updatedProgress.started_at,
        completedAt: updatedProgress.completed_at || null,
        answers: updatedProgress.answers as Record<string, string | string[]> | undefined
      };

      return res.status(200).json({
        success: true,
        data: formattedProgress
      });
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to update lesson progress' }
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: { message: 'Method not allowed' }
  });
}

export default authMiddleware(handler);