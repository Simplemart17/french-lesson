import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { getUserId } from '@/utils/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = supabaseAdmin ?? supabase;

  // Get user ID from authenticated user
  const userId = await getUserId(req);
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

      // Build query for vocabulary items
      let vocabularyQuery = db
        .from(TABLES.VOCABULARY)
        .select('*')
        .order('french', { ascending: true });

      // Apply filters
      if (level && typeof level === 'string') {
        vocabularyQuery = vocabularyQuery.eq('level', level);
      }

      if (category && typeof category === 'string') {
        vocabularyQuery = vocabularyQuery.eq('category', category);
      }

      const { data: vocabulary, error: vocabularyError } = await vocabularyQuery;

      if (vocabularyError) {
        console.error('Error fetching vocabulary:', vocabularyError);
        throw new Error(`Failed to fetch vocabulary: ${vocabularyError.message}`);
      }

      if (!vocabulary || vocabulary.length === 0) {
        return res.status(200).json({
          success: true,
          data: []
        });
      }

      // Get user vocabulary progress for these items
      const { data: userVocabularyItems, error: userVocabError } = await db
        .from(TABLES.USER_VOCABULARY)
        .select('*')
        .eq('user_id', userId)
        .in('vocabulary_id', vocabulary.map(item => item.id));

      if (userVocabError) {
        console.error('Error fetching user vocabulary progress:', userVocabError);
      }

      // Create a map of vocabulary ID to user progress
      const userProgressMap = new Map();
      (userVocabularyItems || []).forEach(item => {
        userProgressMap.set(item.vocabulary_id, {
          learned: item.learned,
          lastPracticed: item.last_practiced,
          nextReviewDate: item.next_review_date,
          repetitionStage: item.repetition_stage
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
          level: item.level,
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
        data: result,
        vocabulary: result
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

      // Check if vocabulary already exists
      const { data: existingVocabulary, error: checkError } = await db
        .from(TABLES.VOCABULARY)
        .select('id')
        .eq('french', word)
        .maybeSingle();

      if (checkError) {
        throw new Error(`Error checking existing vocabulary: ${checkError.message}`);
      }

      if (existingVocabulary) {
        return res.status(400).json({
          success: false,
          error: { message: 'Vocabulary item already exists' }
        });
      }

      // Create new vocabulary item
      const { data: newVocabulary, error: createError } = await db
        .from(TABLES.VOCABULARY)
        .insert({
          french: word,
          english: translation,
          example: example || '',
          level: level,
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
          level: newVocabulary.level,
          category: newVocabulary.category,
          pronunciation: newVocabulary.pronunciation
        },
        vocabulary: {
          id: newVocabulary.id,
          word: newVocabulary.french,
          translation: newVocabulary.english,
          example: newVocabulary.example,
          level: newVocabulary.level,
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
