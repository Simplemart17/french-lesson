import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { prisma } from '../../../lib/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET request
  if (req.method === 'GET') {
    try {
      // Get user ID from authenticated user
      const userId = (req as any).user?.id;
      
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
        lessonId: item.lessonId,
        completed: item.completed,
        score: item.score,
        lastAccessed: item.startedAt?.toISOString() || null,
        completedAt: item.completedAt?.toISOString() || null
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
      const { lessonId, completed, score } = req.body;
      
      if (!lessonId || typeof completed !== 'boolean' || typeof score !== 'number') {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid request body' }
        });
      }
      
      // Get user ID from authenticated user
      const userId = (req as any).user?.id;
      
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
          completedAt: completed ? now : undefined
        },
        create: {
          userId,
          lessonId,
          completed,
          score,
          startedAt: now,
          completedAt: completed ? now : null
        }
      });
      
      // Format the data for the response
      const formattedProgress = {
        lessonId: updatedProgress.lessonId,
        completed: updatedProgress.completed,
        score: updatedProgress.score,
        lastAccessed: updatedProgress.startedAt?.toISOString() || null,
        completedAt: updatedProgress.completedAt?.toISOString() || null
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
