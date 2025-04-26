import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

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
    try {
      const { level, topic, id } = req.query;

      // Get a specific lesson by ID
      if (id) {
        const lessonId = parseInt(id as string, 10);

        // Get the lesson from the database
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId }
        });

        if (!lesson) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Lesson not found'
            }
          });
        }

        // Get user's progress for this lesson, if any
        const progress = await prisma.lessonProgress.findFirst({
          where: {
            userId: userId,
            lessonId: lessonId
          }
        });

        return res.status(200).json({
          success: true,
          data: {
            ...lesson,
            progress: progress || null
          }
        });
      }

      // Build the query for filtering lessons
      const whereClause: any = {};

      if (level) {
        whereClause.level = level as string;
      }

      if (topic) {
        whereClause.topics = {
          has: topic as string
        };
      }

      // Get lessons from the database
      const lessons = await prisma.lesson.findMany({
        where: whereClause
      });

      // Return list of lessons (without full content)
      return res.status(200).json({
        success: true,
        data: lessons
      });
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  } else if (req.method === 'POST') {
    // For tracking lesson progress/completion
    try {
      const { lessonId, completed, score, startedAt, completedAt } = req.body;

      if (!lessonId) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Lesson ID is required'
          }
        });
      }

      // Check if the lesson exists
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId }
      });

      if (!lesson) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Lesson not found'
          }
        });
      }

      // Check if progress already exists
      const existingProgress = await prisma.lessonProgress.findFirst({
        where: {
          userId: userId,
          lessonId: lessonId
        }
      });

      let progress;

      if (existingProgress) {
        // Update existing progress
        progress = await prisma.lessonProgress.update({
          where: {
            id: existingProgress.id
          },
          data: {
            completed: completed || false,
            score: score || 0,
            completedAt: completedAt ? new Date(completedAt) : undefined
          }
        });
      } else {
        // Create new progress
        progress = await prisma.lessonProgress.create({
          data: {
            userId: userId,
            lessonId: lessonId,
            completed: completed || false,
            score: score || 0,
            startedAt: startedAt ? new Date(startedAt) : new Date(),
            completedAt: completedAt ? new Date(completedAt) : undefined
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Lesson progress update error:', error);
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