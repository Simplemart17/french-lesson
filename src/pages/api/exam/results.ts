import { NextApiRequest, NextApiResponse } from 'next';
import { saveExamResult, getUserExamResults } from '@/utils/mockDb';
import { ApiResponse, ExamResult } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ 
      success: false, 
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const userId = getUserId(req);

  if (req.method === 'GET') {
    // Get the user's exam results
    const { examId, level, section } = req.query;
    
    let results = getUserExamResults(userId);
    
    // Filter results if query parameters are provided
    if (examId) {
      results = results.filter(r => r.examId === examId);
    }
    
    if (level) {
      results = results.filter(r => r.level === level);
    }
    
    if (section) {
      results = results.filter(r => r.section === section);
    }
    
    // Return filtered results
    return res.status(200).json({
      success: true,
      data: results
    });
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
      
      // Create the exam result object
      const examResult: ExamResult = {
        userId,
        examId,
        section,
        level,
        score,
        details,
        completedAt: new Date().toISOString()
      };
      
      // Save the result
      const savedResult = saveExamResult(examResult);
      
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