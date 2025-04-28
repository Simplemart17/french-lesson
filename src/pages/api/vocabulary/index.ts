import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { prisma } from '../../../lib/prisma';
import { getUserId } from '@/utils/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get user ID from authenticated user
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'User not authenticated' }
    });
  }

  // GET request to retrieve vocabulary lists
  if (req.method === 'GET') {
    try {
      const { level, category } = req.query;

      // Build the where clause based on query parameters
      const where: any = {};

      if (level) {
        where.level = level as string;
      }

      if (category) {
        where.category = category as string;
      }

      // Fetch vocabulary from database
      const vocabulary = await prisma.vocabulary.findMany({
        where,
        orderBy: {
          word: 'asc'
        }
      });

      // Get user vocabulary progress for these items
      const userVocabularyItems = await prisma.userVocabulary.findMany({
        where: {
          userId,
          vocabularyId: {
            in: vocabulary.map(item => item.id)
          }
        }
      });

      // Create a map of vocabulary ID to user progress
      const userProgressMap = new Map();
      userVocabularyItems.forEach(item => {
        userProgressMap.set(item.vocabularyId, {
          learned: item.learned,
          lastPracticed: item.lastPracticed,
          nextReviewDate: item.nextReviewDate,
          repetitionStage: item.repetitionStage
        });
      });

      // Combine vocabulary with user progress
      const result = vocabulary.map(item => {
        const userProgress = userProgressMap.get(item.id);
        return {
          id: item.id,
          word: item.word,
          translation: item.translation,
          example: item.example,
          level: item.level,
          category: item.category,
          pronunciation: item.pronunciation,
          usageContext: item.usageContext,
          learned: userProgress ? userProgress.learned : false,
          lastPracticed: userProgress ? userProgress.lastPracticed : null,
          nextReview: userProgress ? userProgress.nextReviewDate : null,
          repetitionStage: userProgress ? userProgress.repetitionStage : 0
        };
      });

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch vocabulary' }
      });
    }
  }

  // POST request to add a new vocabulary item
  if (req.method === 'POST') {
    try {
      const {
        word,
        translation,
        example,
        level,
        category,
        pronunciation,
        usageContext
      } = req.body;

      // Validate required fields
      if (!word || !translation || !level) {
        return res.status(400).json({
          success: false,
          error: { message: 'Word, translation, and level are required' }
        });
      }

      // Check if vocabulary already exists
      const existingVocabulary = await prisma.vocabulary.findUnique({
        where: { word }
      });

      if (existingVocabulary) {
        return res.status(400).json({
          success: false,
          error: { message: 'Vocabulary item already exists' }
        });
      }

      // Create new vocabulary item
      const newVocabulary = await prisma.vocabulary.create({
        data: {
          word,
          translation,
          example: example || '',
          level,
          category: category || null,
          pronunciation: pronunciation || null,
          usageContext: usageContext || []
        }
      });

      return res.status(201).json({
        success: true,
        data: newVocabulary
      });
    } catch (error) {
      console.error('Error adding vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to add vocabulary' }
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: { message: 'Method not allowed' }
  });
}

export default authMiddleware(handler);
