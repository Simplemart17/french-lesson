import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, VocabularyItem } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

// Mock user vocabulary progress
const userVocabularyProgress: Record<number, VocabularyItem[]> = {
  1: [
    {
      word: 'bonjour',
      translation: 'hello',
      example: 'Bonjour! Comment allez-vous?',
      level: 'A1',
      category: 'greetings',
      learned: true,
      lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
    },
    {
      word: 'merci',
      translation: 'thank you',
      example: 'Merci beaucoup pour votre aide.',
      level: 'A1',
      category: 'greetings',
      learned: true,
      lastPracticed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
    },
    {
      word: 'au revoir',
      translation: 'goodbye',
      example: 'Au revoir et à bientôt!',
      level: 'A1',
      category: 'greetings',
      learned: false
    }
  ]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<VocabularyItem[] | VocabularyItem>>
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

  // GET request to retrieve user vocabulary progress
  if (req.method === 'GET') {
    try {
      // Get user vocabulary progress
      const userProgress = userVocabularyProgress[userId] || [];

      return res.status(200).json({
        success: true,
        data: userProgress
      });
    } catch (error) {
      console.error('Error fetching vocabulary progress:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  // PUT request to update vocabulary progress
  if (req.method === 'PUT') {
    try {
      const { word, learned, lastPracticed, nextReview } = req.body;

      // Validate required fields
      if (!word) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Missing required fields'
          }
        });
      }

      // Get user vocabulary progress
      const userProgress = userVocabularyProgress[userId] || [];

      // Find the vocabulary item
      const itemIndex = userProgress.findIndex(item => item.word === word);

      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Vocabulary item not found'
          }
        });
      }

      // Update the vocabulary item
      userProgress[itemIndex] = {
        ...userProgress[itemIndex],
        learned: learned !== undefined ? learned : userProgress[itemIndex].learned,
        lastPracticed: lastPracticed || new Date().toISOString(),
        nextReview: nextReview || userProgress[itemIndex].nextReview
      };

      // Save the updated progress
      userVocabularyProgress[userId] = userProgress;

      return res.status(200).json({
        success: true,
        data: userProgress[itemIndex]
      });
    } catch (error) {
      console.error('Error updating vocabulary progress:', error);
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
