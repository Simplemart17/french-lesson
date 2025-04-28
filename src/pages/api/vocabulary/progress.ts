import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, VocabularyItem } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

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
      // Get user vocabulary progress from database
      const userVocabularyItems = await prisma.userVocabulary.findMany({
        where: {
          userId
        },
        include: {
          vocabulary: true
        },
        orderBy: {
          lastPracticed: 'desc'
        }
      });

      // Format the response
      const userProgress = userVocabularyItems.map(item => ({
        id: item.vocabularyId,
        word: item.vocabulary.word,
        translation: item.vocabulary.translation,
        example: item.vocabulary.example,
        level: item.vocabulary.level,
        category: item.vocabulary.category,
        pronunciation: item.vocabulary.pronunciation,
        usageContext: item.vocabulary.usageContext,
        learned: item.learned,
        lastPracticed: item.lastPracticed ? item.lastPracticed.toISOString() : null,
        nextReview: item.nextReviewDate ? item.nextReviewDate.toISOString() : null,
        repetitionStage: item.repetitionStage
      }));

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
      const { word, learned, lastPracticed, nextReview, repetitionStage } = req.body;

      // Validate required fields
      if (!word) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Word is required'
          }
        });
      }

      // Find the vocabulary item
      const vocabularyItem = await prisma.vocabulary.findUnique({
        where: { word }
      });

      if (!vocabularyItem) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Vocabulary item not found'
          }
        });
      }

      // Calculate next review date if not provided
      let nextReviewDate = nextReview ? new Date(nextReview) : undefined;

      if (learned && !nextReviewDate) {
        // Simple spaced repetition algorithm
        const stage = repetitionStage || 0;
        const daysToAdd = stage === 0 ? 1 :
                          stage === 1 ? 3 :
                          stage === 2 ? 7 :
                          stage === 3 ? 14 : 30;

        nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
      }

      // Update or create user vocabulary progress
      const updatedUserVocabulary = await prisma.userVocabulary.upsert({
        where: {
          userId_vocabularyId: {
            userId,
            vocabularyId: vocabularyItem.id
          }
        },
        update: {
          learned: learned !== undefined ? learned : undefined,
          lastPracticed: lastPracticed ? new Date(lastPracticed) : new Date(),
          nextReviewDate: nextReviewDate,
          repetitionStage: repetitionStage !== undefined ? repetitionStage : undefined
        },
        create: {
          userId,
          vocabularyId: vocabularyItem.id,
          learned: learned !== undefined ? learned : false,
          lastPracticed: lastPracticed ? new Date(lastPracticed) : new Date(),
          nextReviewDate: nextReviewDate,
          repetitionStage: repetitionStage !== undefined ? repetitionStage : 0
        },
        include: {
          vocabulary: true
        }
      });

      // Format the response
      const result = {
        id: updatedUserVocabulary.vocabularyId,
        word: updatedUserVocabulary.vocabulary.word,
        translation: updatedUserVocabulary.vocabulary.translation,
        example: updatedUserVocabulary.vocabulary.example,
        level: updatedUserVocabulary.vocabulary.level,
        category: updatedUserVocabulary.vocabulary.category,
        pronunciation: updatedUserVocabulary.vocabulary.pronunciation,
        usageContext: updatedUserVocabulary.vocabulary.usageContext,
        learned: updatedUserVocabulary.learned,
        lastPracticed: updatedUserVocabulary.lastPracticed ? updatedUserVocabulary.lastPracticed.toISOString() : null,
        nextReview: updatedUserVocabulary.nextReviewDate ? updatedUserVocabulary.nextReviewDate.toISOString() : null,
        repetitionStage: updatedUserVocabulary.repetitionStage
      };

      return res.status(200).json({
        success: true,
        data: result
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
