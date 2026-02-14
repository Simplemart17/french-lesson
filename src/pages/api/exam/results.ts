import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { ApiResponse, ExamResult } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';

interface ExamResultRow {
  id: string;
  user_id: string;
  exam_type: string;
  module: string;
  score: number;
  max_score: number;
  percentage: number;
  level: string | null;
  completed_at: string;
}

function mapRowToResult(row: ExamResultRow): ExamResult {
  return {
    userId: row.user_id,
    examId: row.exam_type,
    section: row.module,
    level: row.level || 'A1',
    score: Number(row.percentage || 0),
    details: [],
    completedAt: row.completed_at,
    timeSpent: 0
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  if (!(await isAuthenticated(req))) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const userId = await getUserId(req);
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const db = supabaseAdmin ?? supabase;

  if (req.method === 'GET') {
    try {
      const { examId, level, section } = req.query;

      let query = db
        .from(TABLES.EXAM_RESULTS)
        .select('id,user_id,exam_type,module,score,max_score,percentage,level,completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (examId && typeof examId === 'string') {
        query = query.eq('exam_type', examId);
      }

      if (level && typeof level === 'string') {
        query = query.eq('level', level);
      }

      if (section && typeof section === 'string') {
        query = query.eq('module', section);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch exam results: ${error.message}`);
      }

      const results = ((data || []) as ExamResultRow[]).map(mapRowToResult);

      return res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error fetching exam results:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        examId,
        section,
        level,
        score,
        details,
        maxScore,
        timeSpent
      } = req.body as {
        examId?: string;
        section?: string;
        level?: string;
        score?: number;
        details?: Array<{ questionIndex: number; correct: boolean; userAnswer: string | string[] }>;
        maxScore?: number;
        timeSpent?: number;
      };

      if (!examId || !section || !level || score === undefined) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Missing required fields: examId, section, level, and score are required'
          }
        });
      }

      const numericScore = Number(score);
      const numericMaxScore = Number(maxScore || 100);
      const percentage = numericMaxScore > 0 ? (numericScore / numericMaxScore) * 100 : 0;

      const { data: saved, error } = await db
        .from(TABLES.EXAM_RESULTS)
        .insert({
          user_id: userId,
          exam_type: examId,
          module: section,
          score: numericScore,
          max_score: numericMaxScore,
          percentage,
          level,
          completed_at: new Date().toISOString()
        })
        .select('id,user_id,exam_type,module,score,max_score,percentage,level,completed_at')
        .single();

      if (error || !saved) {
        throw new Error(`Failed to save exam result: ${error?.message || 'Unknown error'}`);
      }

      return res.status(201).json({
        success: true,
        data: {
          ...mapRowToResult(saved as ExamResultRow),
          details: details || [],
          timeSpent: Number(timeSpent || 0)
        }
      });
    } catch (error) {
      console.error('Exam result error:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: {
      message: 'Method not allowed'
    }
  });
}
