import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, LessonProgress } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/utils/auth';

async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<LessonProgress | LessonProgress[]>>) {
  // Handle GET request
  if (req.method === 'GET') {
    try {
      // Get user ID from authenticated user
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' }
        });
      }

      // Get lessonId from query if provided
      let { lessonId } = req.query;
      const lessonIdNum = lessonId ? parseInt(lessonId as string, 10) : undefined;

      // Build query
      const query: any = { userId };
      if (lessonIdNum && !isNaN(lessonIdNum)) {
        query.lessonId = lessonIdNum;
      }

      // Get progress from database
      const progress = await prisma.lessonProgress.findMany({
        where: query,
        orderBy: {
          lessonId: 'asc',
        },
      });

      // Format the data for the response
      const formattedProgress = progress.map(item => ({
        id: item.id,
        userId: item.userId,
        lessonId: item.lessonId,
        completed: item.completed,
        score: item.score,
        startedAt: item.startedAt?.toISOString(),
        completedAt: item.completedAt?.toISOString() || null,
        answers: item.answers as Record<number, string | string[]> | undefined
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
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not authenticated' }
        });
      }

      // Check if lesson exists
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId }
      });

      if (!lesson) {
        return res.status(404).json({
          success: false,
          error: { message: 'Lesson not found' }
        });
      }

      // Get current timestamp
      const now = new Date();

      // Update or create progress
      const updatedProgress = await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId
          }
        },
        update: {
          completed,
          score,
          startedAt: { set: now },
          completedAt: completed ? now : undefined,
          answers: answers || undefined
        },
        create: {
          userId,
          lessonId,
          completed,
          score,
          startedAt: now,
          completedAt: completed ? now : null,
          answers: answers || undefined
        }
      });

      // Format the data for the response
      const formattedProgress: LessonProgress = {
        id: updatedProgress.id,
        userId: updatedProgress.userId,
        lessonId: updatedProgress.lessonId,
        completed: updatedProgress.completed,
        score: updatedProgress.score,
        startedAt: updatedProgress.startedAt?.toISOString(),
        completedAt: updatedProgress.completedAt?.toISOString() || null,
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
