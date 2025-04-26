import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';

// Sample progress data for demonstration
// In a real app this would come from a database
const progressData = [
  {
    userId: 1,
    lessonId: 1,
    completed: true,
    score: 100,
    lastAccessed: '2023-06-15T10:30:00Z',
    completedAt: '2023-06-15T11:00:00Z'
  },
  {
    userId: 1,
    lessonId: 2,
    completed: false,
    score: 75,
    lastAccessed: '2023-06-16T14:20:00Z',
    completedAt: null
  },
  {
    userId: 1,
    lessonId: 3,
    completed: false,
    score: 30,
    lastAccessed: '2023-06-17T09:45:00Z',
    completedAt: null
  }
];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET request
  if (req.method === 'GET') {
    try {
      // In a real app, we would get the user ID from the authenticated user
      const userId = 1; // Mock user ID
      let { lessonId } = req.query;
      
      // Filter progress by lesson ID if provided
      let userProgress = progressData.filter(progress => progress.userId === userId);
      
      if (lessonId && !isNaN(Number(lessonId))) {
        userProgress = userProgress.filter(progress => 
          progress.lessonId === Number(lessonId)
        );
      }
      
      return res.status(200).json({
        success: true,
        data: userProgress
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
      
      // In a real app, we would get the user ID from the authenticated user
      const userId = 1; // Mock user ID
      
      // Find existing progress or create new
      const existingProgressIndex = progressData.findIndex(
        p => p.userId === userId && p.lessonId === lessonId
      );
      
      const now = new Date().toISOString();
      let updatedProgress;
      
      if (existingProgressIndex >= 0) {
        // Update existing progress
        updatedProgress = {
          ...progressData[existingProgressIndex],
          completed,
          score,
          lastAccessed: now,
          completedAt: completed ? now : progressData[existingProgressIndex].completedAt
        };
        
        // Update in the array (in a real app this would be a database update)
        // progressData[existingProgressIndex] = updatedProgress;
      } else {
        // Create new progress
        updatedProgress = {
          userId,
          lessonId,
          completed,
          score,
          lastAccessed: now,
          completedAt: completed ? now : null
        };
        
        // Add to the array (in a real app this would be a database insert)
        // progressData.push(updatedProgress);
      }
      
      return res.status(200).json({
        success: true,
        data: updatedProgress
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
