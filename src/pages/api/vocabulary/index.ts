import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { getSupabaseClient, TABLES } from '@/lib/supabase';
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
      const supabase = getSupabaseClient();

      // Build query for vocabulary items
      let vocabularyQuery = supabase
        .from(TABLES.VOCABULARY)
        .select('*')
        .order('french', { ascending: true });

      // Apply filters
      if (level && typeof level === 'string') {
        vocabularyQuery = vocabularyQuery.eq('difficulty', level);
      }

      if (category && typeof category === 'string') {
        vocabularyQuery = vocabularyQuery.eq('category', category);
      }

      const { data: vocabulary, error: vocabularyError } = await vocabularyQuery;

      if (vocabularyError) {
        // If table doesn't exist, return mock data for development
        if (vocabularyError.message.includes('does not exist')) {
          const mockVocabulary = [
            {
              id: '1',
              word: 'bonjour',
              translation: 'hello',
              example: 'Bonjour, comment allez-vous?',
              level: 'A1',
              category: 'greetings',
              pronunciation: 'bon-ZHOOR',
              learned: false,
              lastPracticed: null,
              nextReview: null,
              repetitionStage: 0
            },
            {
              id: '2',
              word: 'merci',
              translation: 'thank you',
              example: 'Merci beaucoup pour votre aide.',
              level: 'A1',
              category: 'politeness',
              pronunciation: 'mer-SEE',
              learned: true,
              lastPracticed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              repetitionStage: 2
            },
            {
              id: '3',
              word: 'au revoir',
              translation: 'goodbye',
              example: 'Au revoir, à bientôt!',
              level: 'A1',
              category: 'greetings',
              pronunciation: 'oh ruh-VWAR',
              learned: false,
              lastPracticed: null,
              nextReview: null,
              repetitionStage: 0
            }
          ];

          // Apply filters
          let filteredVocabulary = mockVocabulary;

          if (level && typeof level === 'string') {
            filteredVocabulary = filteredVocabulary.filter(item => item.level === level);
          }

          if (category && typeof category === 'string') {
            filteredVocabulary = filteredVocabulary.filter(item => item.category === category);
          }

          return res.status(200).json({
            success: true,
            data: filteredVocabulary
          });
        }

        throw new Error(`Failed to fetch vocabulary: ${vocabularyError.message}`);
      }

      if (!vocabulary || vocabulary.length === 0) {
        return res.status(200).json({
          success: true,
          data: []
        });
      }

      // Get user vocabulary progress for these items
      const { data: userVocabularyItems, error: userVocabError } = await supabase
        .from(TABLES.USER_VOCABULARY)
        .select('*')
        .eq('userId', userId)
        .in('vocabularyId', vocabulary.map(item => item.id));

      if (userVocabError) {
        console.error('Error fetching user vocabulary progress:', userVocabError);
      }

      // Create a map of vocabulary ID to user progress
      const userProgressMap = new Map();
      (userVocabularyItems || []).forEach(item => {
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
          word: item.french,
          translation: item.english,
          example: item.example || '',
          level: item.difficulty,
          category: item.category,
          pronunciation: item.pronunciation,
          usageContext: [],
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
        pronunciation
      } = req.body;

      // Validate required fields
      if (!word || !translation || !level) {
        return res.status(400).json({
          success: false,
          error: { message: 'Word, translation, and level are required' }
        });
      }

      const supabase = getSupabaseClient();

      // Check if vocabulary already exists
      const { data: existingVocabulary, error: checkError } = await supabase
        .from(TABLES.VOCABULARY)
        .select('id')
        .eq('french', word)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
        throw new Error(`Error checking existing vocabulary: ${checkError.message}`);
      }

      if (existingVocabulary) {
        return res.status(400).json({
          success: false,
          error: { message: 'Vocabulary item already exists' }
        });
      }

      // Create new vocabulary item
      const { data: newVocabulary, error: createError } = await supabase
        .from(TABLES.VOCABULARY)
        .insert({
          french: word,
          english: translation,
          example: example || '',
          difficulty: level,
          category: category || 'general',
          pronunciation: pronunciation || null
        })
        .select()
        .single();

      if (createError) {
        throw new Error(`Failed to create vocabulary: ${createError.message}`);
      }

      return res.status(201).json({
        success: true,
        data: {
          id: newVocabulary.id,
          word: newVocabulary.french,
          translation: newVocabulary.english,
          example: newVocabulary.example,
          level: newVocabulary.difficulty,
          category: newVocabulary.category,
          pronunciation: newVocabulary.pronunciation
        }
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
