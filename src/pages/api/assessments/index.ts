import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { prisma } from '../../../lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get user ID from authenticated user
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'User not authenticated' }
    });
  }

  // GET request to retrieve assessments
  if (req.method === 'GET') {
    try {
      const assessments = await prisma.examResult.findMany({
        where: {
          userId
        },
        orderBy: {
          completedAt: 'desc'
        }
      });

      return res.status(200).json({
        success: true,
        data: assessments
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
      const { level, score, section, examId, details, timeSpent } = req.body;

      if (!level || score === undefined || !section || !examId) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required fields' }
        });
      }

      // Create new assessment using the ExamResult model
      const assessment = await prisma.examResult.create({
        data: {
          userId,
          level,
          score,
          section,
          examId,
          details: details || {},
          completedAt: new Date(),
          timeSpent: timeSpent || 0, // Add the timeSpent field with a default value of 0
          user: {
            connect: {
              id: userId
            }
          }
        }
      });

      // Check if this is the user's best score by finding previous results for this exam
      const previousResults = await prisma.examResult.findMany({
        where: {
          userId,
          examId,
          section,
          level
        },
        orderBy: {
          score: 'desc'
        },
        take: 1
      });

      const isNewHighScore = previousResults.length === 0 ||
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