import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';

// Define the grammar progress type
interface GrammarProgress {
  exerciseId: number;
  bestScore: number;
  attempts: number;
  lastAttempt: string;
}

// Mock grammar progress data
const mockGrammarProgress: GrammarProgress[] = [
  {
    exerciseId: 1,
    bestScore: 90,
    attempts: 3,
    lastAttempt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    exerciseId: 2,
    bestScore: 85,
    attempts: 2,
    lastAttempt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    exerciseId: 3,
    bestScore: 70,
    attempts: 4,
    lastAttempt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GrammarProgress[] | GrammarProgress>>
) {
  // Handle GET request to retrieve progress
  if (req.method === 'GET') {
    try {
      return res.status(200).json({
        success: true,
        data: mockGrammarProgress
      });
    } catch (error) {
      console.error('Error in grammar progress API:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }
  
  // Handle POST request to update progress
  if (req.method === 'POST') {
    try {
      const { exerciseId, score } = req.body;
      
      // Validate input
      if (!exerciseId || isNaN(exerciseId) || !score || isNaN(score)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid exerciseId or score'
          }
        });
      }
      
      // Find existing progress for this exercise
      const existingProgressIndex = mockGrammarProgress.findIndex(
        p => p.exerciseId === exerciseId
      );
      
      let updatedProgress: GrammarProgress;
      
      if (existingProgressIndex >= 0) {
        // Update existing progress
        const existing = mockGrammarProgress[existingProgressIndex];
        updatedProgress = {
          ...existing,
          bestScore: Math.max(existing.bestScore, score),
          attempts: existing.attempts + 1,
          lastAttempt: new Date().toISOString()
        };
        
        // Update the mock data (in a real app, this would update the database)
        mockGrammarProgress[existingProgressIndex] = updatedProgress;
      } else {
        // Create new progress entry
        updatedProgress = {
          exerciseId,
          bestScore: score,
          attempts: 1,
          lastAttempt: new Date().toISOString()
        };
        
        // Add to mock data (in a real app, this would insert into the database)
        mockGrammarProgress.push(updatedProgress);
      }
      
      // Return the updated progress
      return res.status(200).json({
        success: true,
        data: updatedProgress
      });
    } catch (error) {
      console.error('Error updating grammar progress:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }
  
  // Handle other HTTP methods
  return res.status(405).json({
    success: false,
    error: {
      message: 'Method not allowed'
    }
  });
}
