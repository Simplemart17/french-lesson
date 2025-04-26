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
      const { level, category, learned } = req.query;

      // Get user's vocabulary progress
      if (learned === 'true' || learned === 'false') {
        const isLearned = learned === 'true';

        const userVocab = await prisma.userVocabulary.findMany({
          where: {
            userId: userId,
            learned: isLearned,
            ...(level ? { level: level as string } : {})
          },
          include: {
            vocabulary: true
          }
        });

        return res.status(200).json({
          success: true,
          data: userVocab.map(item => ({
            id: item.vocabularyId,
            word: item.vocabulary.word,
            translation: item.vocabulary.translation,
            example: item.vocabulary.example,
            level: item.vocabulary.level,
            learned: item.learned,
            lastPracticed: item.lastPracticed
          }))
        });
      }

      // Get vocabulary categories and levels
      if (!level && !category) {
        const levels = await prisma.vocabulary.groupBy({
          by: ['level']
        });

        // Get all vocabulary items
        const allVocabulary = await prisma.vocabulary.findMany();

        // Group categories by level
        const categoriesByLevel: Record<string, string[]> = {};

        // Process each vocabulary item
        allVocabulary.forEach(item => {
          // Initialize the level array if it doesn't exist
          if (!categoriesByLevel[item.level]) {
            categoriesByLevel[item.level] = [];
          }

          // Add the category if it's not already in the array
          // Note: In a real database, you would have a category field in your vocabulary table
          // For now, we'll use a dummy category based on the word's first letter
          const dummyCategory = item.word.charAt(0).toUpperCase();
          if (!categoriesByLevel[item.level].includes(dummyCategory)) {
            categoriesByLevel[item.level].push(dummyCategory);
          }
        });

        return res.status(200).json({
          success: true,
          data: {
            levels: levels.map(l => l.level),
            categories: categoriesByLevel
          }
        });
      }

      // Filter by level
      if (level && !category) {
        const vocabulary = await prisma.vocabulary.findMany({
          where: {
            level: level as string
          }
        });

        // Get user vocabulary for these items
        const userVocabularyItems = await prisma.userVocabulary.findMany({
          where: {
            userId: userId,
            vocabularyId: {
              in: vocabulary.map(item => item.id)
            }
          }
        });

        // Create a map of vocabulary ID to learned status
        const learnedMap = new Map<number, boolean>();
        userVocabularyItems.forEach(item => {
          learnedMap.set(item.vocabularyId, item.learned);
        });

        // Group by first letter (as a dummy category)
        const groupedByCategory: Record<string, any[]> = {};

        vocabulary.forEach(item => {
          // Use first letter as dummy category
          const dummyCategory = item.word.charAt(0).toUpperCase();

          if (!groupedByCategory[dummyCategory]) {
            groupedByCategory[dummyCategory] = [];
          }

          groupedByCategory[dummyCategory].push({
            id: item.id,
            word: item.word,
            translation: item.translation,
            example: item.example,
            level: item.level,
            learned: learnedMap.has(item.id) ? learnedMap.get(item.id) : false
          });
        });

        return res.status(200).json({
          success: true,
          data: groupedByCategory
        });
      }

      // Filter by level and category
      if (level && category) {
        // In a real database, you would filter by category
        // For now, we'll use the first letter as a dummy category
        const vocabulary = await prisma.vocabulary.findMany({
          where: {
            level: level as string,
            word: {
              startsWith: category as string
            }
          }
        });

        if (vocabulary.length === 0) {
          return res.status(400).json({
            success: false,
            error: {
              message: 'No vocabulary found for this level and category'
            }
          });
        }

        // Get user vocabulary for these items
        const userVocabularyItems = await prisma.userVocabulary.findMany({
          where: {
            userId: userId,
            vocabularyId: {
              in: vocabulary.map(item => item.id)
            }
          }
        });

        // Create a map of vocabulary ID to learned status
        const learnedMap = new Map<number, boolean>();
        userVocabularyItems.forEach(item => {
          learnedMap.set(item.vocabularyId, item.learned);
        });

        return res.status(200).json({
          success: true,
          data: vocabulary.map(item => ({
            id: item.id,
            word: item.word,
            translation: item.translation,
            example: item.example,
            level: item.level,
            learned: learnedMap.has(item.id) ? learnedMap.get(item.id) : false
          }))
        });
      }

      // Should never reach here
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid request'
        }
      });
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  } else if (req.method === 'POST') {
    // Track user progress with vocabulary
    try {
      const { word, translation, example, level, learned, lastPracticed } = req.body;

      if (!word) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Word is required'
          }
        });
      }

      // Find the vocabulary item
      let vocabularyItem = await prisma.vocabulary.findFirst({
        where: {
          word: word
        }
      });

      // If the vocabulary item doesn't exist, create it
      if (!vocabularyItem) {
        if (!translation || !level) {
          return res.status(400).json({
            success: false,
            error: {
              message: 'Translation and level are required for new vocabulary items'
            }
          });
        }

        vocabularyItem = await prisma.vocabulary.create({
          data: {
            word,
            translation,
            example: example || '',
            level
          }
        });
      }

      // Check if the user already has this vocabulary item
      const userVocabularyItem = await prisma.userVocabulary.findFirst({
        where: {
          userId: userId,
          vocabularyId: vocabularyItem.id
        }
      });

      let result;

      if (userVocabularyItem) {
        // Update existing user vocabulary item
        result = await prisma.userVocabulary.update({
          where: {
            id: userVocabularyItem.id
          },
          data: {
            learned: learned !== undefined ? learned : userVocabularyItem.learned,
            lastPracticed: lastPracticed ? new Date(lastPracticed) : userVocabularyItem.lastPracticed
          },
          include: {
            vocabulary: true
          }
        });
      } else {
        // Create new user vocabulary item
        result = await prisma.userVocabulary.create({
          data: {
            userId: userId,
            vocabularyId: vocabularyItem.id,
            learned: learned || false,
            lastPracticed: lastPracticed ? new Date(lastPracticed) : new Date()
          },
          include: {
            vocabulary: true
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: result.vocabularyId,
          word: result.vocabulary.word,
          translation: result.vocabulary.translation,
          example: result.vocabulary.example,
          level: result.vocabulary.level,
          learned: result.learned,
          lastPracticed: result.lastPracticed
        }
      });
    } catch (error) {
      console.error('Vocabulary progress error:', error);
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