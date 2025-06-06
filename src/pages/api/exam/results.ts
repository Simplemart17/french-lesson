import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, TABLES } from'@/lib/supabase';
import { ApiResponse, ExamResult } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  // Check authentication
  if (!(await isAuthenticated(req))) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const userId = await getUserId(req);

  if (req.method === 'GET') {
    try {
      // Get the user's exam results (mock data)
      const { examId, level, section } = req.query;

      let results: ExamResult[] = [
        {
          examId: 'french-a1-basics',
          userId: userId || 'test-user-id',
          level: 'A1',
          section: 'grammar',
          score: 85,
          details: [
            { questionIndex: 0, correct: true, userAnswer: 'le' },
            { questionIndex: 1, correct: false, userAnswer: 'la' },
            { questionIndex: 2, correct: true, userAnswer: 'les' }
          ],
          completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          timeSpent: 1200 // 20 minutes
        },
        {
          examId: 'french-a1-vocabulary',
          userId: userId || 'test-user-id',
          level: 'A1',
          section: 'vocabulary',
          score: 92,
          details: [
            { questionIndex: 0, correct: true, userAnswer: 'bonjour' },
            { questionIndex: 1, correct: true, userAnswer: 'merci' },
            { questionIndex: 2, correct: false, userAnswer: 'au revoir' }
          ],
          completedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          timeSpent: 900 // 15 minutes
        }
      ];

      // Filter results if query parameters are provided
      if (examId && typeof examId === 'string') {
        results = results.filter(r => r.examId === examId);
      }

      if (level && typeof level === 'string') {
        results = results.filter(r => r.level === level);
      }

      if (section && typeof section === 'string') {
        results = results.filter(r => r.section === section);
      }

      // Return filtered results
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
  } else if (req.method === 'POST') {
    // Save a new exam result
    try {
      const { examId, section, level, score, details } = req.body;
      
      // Validate required fields
      if (!examId || !section || !level || score === undefined || !details) {
        return res.status(400).json({ 
          success: false, 
          error: {
            message: 'Missing required fields: examId, section, level, score, and details are required'
          }
        });
      }
      
      // Create the exam result object and save to database

      const { data: savedResult, error: createError } = await supabase
        .from(TABLES.EXAM_RESULTS)
        .insert({
          userId,
          examType: examId, // Map examId to examType
          score,
          totalQuestions: 10, // Default value
          correctAnswers: Math.round((score / 100) * 10), // Calculate from score
          timeSpent: req.body.timeSpent || 0,
          completedAt: new Date().toISOString(),
          answers: details
        })
        .select()
        .single();

      if (createError || !savedResult) {
        throw new Error(`Failed to save exam result: ${createError?.message}`);
      }
      
      return res.status(201).json({
        success: true,
        data: savedResult
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
  } else {
    return res.status(405).json({ 
      success: false, 
      error: {
        message: 'Method not allowed'
      }
    });
  }
} 