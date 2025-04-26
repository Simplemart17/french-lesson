import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, LessonProgress } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

// Mock lesson progress data
const userLessonProgress: Record<number, LessonProgress[]> = {
  1: [
    {
      lessonId: 1,
      completed: true,
      score: 90,
      lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    {
      lessonId: 2,
      completed: true,
      score: 85,
      lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },
    {
      lessonId: 3,
      completed: false,
      score: 0,
      lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      completedAt: null
    }
  ]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LessonProgress[] | LessonProgress>>
) {
  // Check if user is authenticated
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const userId = getUserId(req);

  // GET request to retrieve user lesson progress
  if (req.method === 'GET') {
    try {
      const { lessonId } = req.query;
      
      // Get user lesson progress
      const userProgress = userLessonProgress[userId] || [];
      
      // If lessonId is provided, return progress for that lesson
      if (lessonId) {
        const lessonProgress = userProgress.find(progress => progress.lessonId === parseInt(lessonId as string));
        
        if (!lessonProgress) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Lesson progress not found'
            }
          });
        }
        
        return res.status(200).json({
          success: true,
          data: lessonProgress
        });
      }
      
      // Otherwise, return all progress
      return res.status(200).json({
        success: true,
        data: userProgress
      });
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  // POST request to update lesson progress
  if (req.method === 'POST') {
    try {
      const { lessonId, completed, score } = req.body;

      // Validate required fields
      if (!lessonId) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Missing required fields'
          }
        });
      }

      // Get user lesson progress
      const userProgress = userLessonProgress[userId] || [];

      // Find the lesson progress
      const progressIndex = userProgress.findIndex(progress => progress.lessonId === parseInt(lessonId));

      let updatedProgress: LessonProgress;

      if (progressIndex === -1) {
        // Create new progress if it doesn't exist
        updatedProgress = {
          lessonId: parseInt(lessonId),
          completed: completed || false,
          score: score || 0,
          lastAccessed: new Date().toISOString(),
          completedAt: completed ? new Date().toISOString() : null
        };

        userProgress.push(updatedProgress);
      } else {
        // Update existing progress
        updatedProgress = {
          ...userProgress[progressIndex],
          completed: completed !== undefined ? completed : userProgress[progressIndex].completed,
          score: score !== undefined ? score : userProgress[progressIndex].score,
          lastAccessed: new Date().toISOString(),
          completedAt: completed ? new Date().toISOString() : userProgress[progressIndex].completedAt
        };

        userProgress[progressIndex] = updatedProgress;
      }

      // Save the updated progress
      userLessonProgress[userId] = userProgress;

      return res.status(200).json({
        success: true,
        data: updatedProgress
      });
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: {
      message: 'Method not allowed'
    }
  });
}
