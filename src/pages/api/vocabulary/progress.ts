import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, VocabularyItem } from '@/types/api';
import { getUserId } from '@/utils/auth';
import { getSupabaseClient, TABLES } from '@/lib/supabase';

interface UserVocabularyWithDetails {
  vocabularyId: string;
  learned: boolean;
  lastPracticed: string | null;
  vocabulary?: {
    word: string;
    translation: string;
    example: string;
    level: string;
    category: string;
    pronunciation: string;
    usageContext: string[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<VocabularyItem[] | VocabularyItem>>
) {
  // Check if user is authenticated
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

  // GET request to retrieve user vocabulary progress
  if (req.method === 'GET') {
    try {
      const supabase = getSupabaseClient();

      // Get user vocabulary progress with vocabulary details
      const { data: userVocabularyItems, error } = await supabase
        .from(TABLES.USER_VOCABULARY)
        .select(`
          *,
        vocabulary:vocabularyId (
          word,
          translation,
          pronunciation,
          category,
          level
        )
        `)
        .eq('userId', userId)
        .order('lastPracticed', { ascending: false });

      if (error) {
        console.error('Error fetching user vocabulary:', error);
        return res.status(500).json({
          success: false,
          error: {
            message: 'Failed to fetch vocabulary progress'
          }
        });
      }

      // Format the response
      const userProgress = (userVocabularyItems || []).map((item: UserVocabularyWithDetails) => ({
        id: item.vocabularyId,
        word: item.vocabulary?.word || '',
        translation: item.vocabulary?.translation || '',
        example: item.vocabulary?.example || '', // Not available in current schema
        level: item.vocabulary?.level || '',
        category: item.vocabulary?.category || undefined,
        pronunciation: item.vocabulary?.pronunciation || undefined,
        usageContext: item.vocabulary?.usageContext || [], // Not available in current schema
        learned: item.learned,
        lastPracticed: item.lastPracticed || undefined,
        nextReview: undefined, // Not available in current schema
        repetitionStage: 0 // Not available in current schema
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
      const supabase = getSupabaseClient();
      const { data: vocabularyItem, error: vocabError } = await supabase
        .from(TABLES.VOCABULARY)
        .select('*')
        .eq('french', word)
        .single();

      if (vocabError || !vocabularyItem) {
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
      const progressData = {
        userId,
        vocabularyId: vocabularyItem.id,
        learned: learned !== undefined ? learned : false,
        lastPracticed: lastPracticed ? lastPracticed : new Date().toISOString(),
        correctCount: 0, // Default value
        incorrectCount: 0 // Default value
      };

      const { data: updatedUserVocabulary, error: upsertError } = await supabase
        .from(TABLES.USER_VOCABULARY)
        .upsert(progressData, {
          onConflict: 'userId,vocabularyId'
        })
        .select(`
          *,
        vocabulary:vocabularyId (
          word,
          translation,
          pronunciation,
          category,
          level
        )
        `)
        .single();

      if (upsertError) {
        console.error('Error updating user vocabulary:', upsertError);
        return res.status(500).json({
          success: false,
          error: {
            message: 'Failed to update vocabulary progress'
          }
        });
      }

      // Format the response
      const result = {
        id: updatedUserVocabulary.vocabularyId,
        word: updatedUserVocabulary.vocabulary?.french || '',
        translation: updatedUserVocabulary.vocabulary?.english || '',
        example: '', // Not available in current schema
        level: updatedUserVocabulary.vocabulary?.level || '',
        category: updatedUserVocabulary.vocabulary?.category || undefined,
        pronunciation: updatedUserVocabulary.vocabulary?.pronunciation || undefined,
        usageContext: [], // Not available in current schema
        learned: updatedUserVocabulary.learned,
        lastPracticed: updatedUserVocabulary.lastPracticed || undefined,
        nextReview: undefined, // Not available in current schema
        repetitionStage: 0 // Not available in current schema
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
