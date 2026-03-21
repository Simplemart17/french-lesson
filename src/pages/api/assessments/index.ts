import type { NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
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
      const db = supabaseAdmin ?? supabase;
      const { data: assessments, error } = await db
        .from(TABLES.EXAM_RESULTS)
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return res.status(200).json({
        success: true,
        data: assessments || [],
        assessments: assessments || []
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

      const db = supabaseAdmin ?? supabase;
      const numericScore = Number(score);
      const maxScore = Number(totalQuestions || 100);
      const percentage = maxScore > 0
        ? Math.max(0, Math.min(100, (numericScore / maxScore) * 100))
        : 0;

      const { data: assessment, error: createError } = await db
        .from(TABLES.EXAM_RESULTS)
        .insert({
          user_id: userId,
          exam_type: examId,
          module: section,
          level,
          score: numericScore,
          max_score: maxScore,
          percentage,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError || !assessment) {
        throw new Error(`Failed to create assessment: ${createError?.message}`);
      }

      // Check if this is the user's best score by finding previous results for this exam
      const { data: previousResults, error: previousError } = await db
        .from(TABLES.EXAM_RESULTS)
        .select('*')
        .eq('user_id', userId)
        .eq('exam_type', examId)
        .order('percentage', { ascending: false })
        .limit(1);

      if (previousError) {
        console.error('Error fetching previous results:', previousError);
      }

      const isNewHighScore = !previousResults || previousResults.length === 0 ||
                             (previousResults.length > 0 && assessment.percentage > previousResults[0].percentage);

      return res.status(201).json({
        success: true,
        data: {
          assessment,
          details: details || {},
          timeSpent: timeSpent || 0
        },
        assessment,
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
