import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { PronunciationProgress } from '@/services/api/pronunciationApiService';

// Mock pronunciation progress data
const mockPronunciationProgress: PronunciationProgress[] = [
  {
    phraseId: 1,
    bestAccuracy: 85,
    attempts: 5,
    lastAttempt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    phraseId: 2,
    bestAccuracy: 92,
    attempts: 3,
    lastAttempt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    phraseId: 3,
    bestAccuracy: 78,
    attempts: 4,
    lastAttempt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    phraseId: 4,
    bestAccuracy: 65,
    attempts: 2,
    lastAttempt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PronunciationProgress[] | PronunciationProgress>>
) {
  // Handle GET request to retrieve progress
  if (req.method === 'GET') {
    try {
      return res.status(200).json({
        success: true,
        data: mockPronunciationProgress
      });
    } catch (error) {
      console.error('Error in pronunciation progress API:', error);
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
      const { phraseId, accuracy } = req.body;
      
      // Validate input
      if (!phraseId || isNaN(phraseId) || !accuracy || isNaN(accuracy)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid phraseId or accuracy'
          }
        });
      }
      
      // Find existing progress for this phrase
      const existingProgressIndex = mockPronunciationProgress.findIndex(
        p => p.phraseId === phraseId
      );
      
      let updatedProgress: PronunciationProgress;
      
      if (existingProgressIndex >= 0) {
        // Update existing progress
        const existing = mockPronunciationProgress[existingProgressIndex];
        updatedProgress = {
          ...existing,
          bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
          attempts: existing.attempts + 1,
          lastAttempt: new Date().toISOString()
        };
        
        // Update the mock data (in a real app, this would update the database)
        mockPronunciationProgress[existingProgressIndex] = updatedProgress;
      } else {
        // Create new progress entry
        updatedProgress = {
          phraseId,
          bestAccuracy: accuracy,
          attempts: 1,
          lastAttempt: new Date().toISOString()
        };
        
        // Add to mock data (in a real app, this would insert into the database)
        mockPronunciationProgress.push(updatedProgress);
      }
      
      // Return the updated progress
      return res.status(200).json({
        success: true,
        data: updatedProgress
      });
    } catch (error) {
      console.error('Error updating pronunciation progress:', error);
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
