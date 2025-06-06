import type { NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { supabase, TABLES } from '@/lib/supabase';
import { AuthenticatedRequest } from '@/types/api';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Get user ID from authenticated user
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'User not authenticated' }
    });
  }

  // GET request to retrieve assessments
  if (req.method === 'GET') {
    try {
      const { data: assessments, error } = await supabase
        .from(TABLES.EXAM_RESULTS)
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return res.status(200).json({
        success: true,
        data: assessments || []
      });
    } catch (error) {
      console.error('Error fetching assessments:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch assessments' }
      });
    }
  }

  // POST request to create a new assessment
  if (req.method === 'POST') {
    try {
      const { level, score, section, examId, details, timeSpent, totalQuestions } = req.body;

      if (!level || score === undefined || !section || !examId) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required fields' }
        });
      }

      // Create new assessment using the ExamResult model
      const defaultTotalQuestions = totalQuestions || 10;

      const { data: assessment, error: createError } = await supabase
        .from(TABLES.EXAM_RESULTS)
        .insert({
          userId,
          examType: level, // Map level to examType
          score,
          totalQuestions: defaultTotalQuestions,
          correctAnswers: Math.round((score / 100) * defaultTotalQuestions), // Calculate from score
          timeSpent: timeSpent || 0,
          completedAt: new Date().toISOString(),
          answers: details || {}
        })
        .select()
        .single();

      if (createError || !assessment) {
        throw new Error(`Failed to create assessment: ${createError?.message}`);
      }

      // Check if this is the user's best score by finding previous results for this exam
      const { data: previousResults, error: previousError } = await supabase
        .from(TABLES.EXAM_RESULTS)
        .select('*')
        .eq('userId', userId)
        .eq('examType', level)
        .order('score', { ascending: false })
        .limit(1);

      if (previousError) {
        console.error('Error fetching previous results:', previousError);
      }

      const isNewHighScore = !previousResults || previousResults.length === 0 ||
                             (previousResults.length > 0 && assessment.score > previousResults[0].score);

      return res.status(201).json({
        success: true,
        data: assessment,
        isNewHighScore
      });
    } catch (error) {
      console.error('Error creating assessment:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to create assessment' }
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: { message: 'Method not allowed' }
  });
}

export default authMiddleware(handler);