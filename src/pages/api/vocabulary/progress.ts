import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, VocabularyItem } from '@/types/api';
import { getUserId } from '@/utils/auth';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';

interface UserVocabularyRow {
  vocabulary_id: string;
  learned: boolean;
  last_practiced: string | null;
  next_review_date: string | null;
  repetition_stage: number;
  vocabulary?: {
    french: string;
    english: string;
    example: string | null;
    level: string;
    category: string | null;
    pronunciation: string | null;
  } | Array<{
    french: string;
    english: string;
    example: string | null;
    level: string;
    category: string | null;
    pronunciation: string | null;
  }>;
}

function mapProgressItem(item: UserVocabularyRow): VocabularyItem {
  const vocabulary = Array.isArray(item.vocabulary) ? item.vocabulary[0] : item.vocabulary;

  return {
    id: item.vocabulary_id,
    word: vocabulary?.french || '',
    translation: vocabulary?.english || '',
    example: vocabulary?.example || '',
    level: vocabulary?.level || 'A1',
    category: vocabulary?.category || undefined,
    pronunciation: vocabulary?.pronunciation || undefined,
    usageContext: [],
    learned: item.learned,
    lastPracticed: item.last_practiced || undefined,
    nextReview: item.next_review_date || undefined,
    repetitionStage: item.repetition_stage || 0
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<VocabularyItem[] | VocabularyItem>>
) {
  const userId = await getUserId(req);
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'User not authenticated' }
    });
  }

  const db = supabaseAdmin ?? supabase;

  if (req.method === 'GET') {
    try {
      const { data, error } = await db
        .from(TABLES.USER_VOCABULARY)
        .select(`
          vocabulary_id,
          learned,
          last_practiced,
          next_review_date,
          repetition_stage,
          vocabulary:vocabulary_id (
            french,
            english,
            example,
            level,
            category,
            pronunciation
          )
        `)
        .eq('user_id', userId)
        .order('last_practiced', { ascending: false });

      if (error) {
        return res.status(500).json({
          success: false,
          error: { message: 'Failed to fetch vocabulary progress' }
        });
      }

      const userProgress = ((data || []) as UserVocabularyRow[]).map(mapProgressItem);

      return res.status(200).json({
        success: true,
        data: userProgress,
        progress: userProgress
      });
    } catch (error) {
      console.error('Error fetching vocabulary progress:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { word, learned, lastPracticed, nextReview } = req.body as {
        word?: string;
        learned?: boolean;
        lastPracticed?: string;
        nextReview?: string;
      };

      if (!word) {
        return res.status(400).json({
          success: false,
          error: { message: 'Word is required' }
        });
      }

      const { data: vocabularyItem, error: vocabError } = await db
        .from(TABLES.VOCABULARY)
        .select('id,french')
        .eq('french', word)
        .maybeSingle();

      if (vocabError || !vocabularyItem) {
        return res.status(404).json({
          success: false,
          error: { message: 'Vocabulary item not found' }
        });
      }

      const now = new Date().toISOString();
      const defaultNextReview = learned ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null;

      const { error: upsertError } = await db
        .from(TABLES.USER_VOCABULARY)
        .upsert(
          {
            user_id: userId,
            vocabulary_id: vocabularyItem.id,
            learned: learned ?? false,
            last_practiced: lastPracticed || now,
            next_review_date: nextReview || defaultNextReview,
            repetition_stage: learned ? 1 : 0
          },
          { onConflict: 'user_id,vocabulary_id' }
        );

      if (upsertError) {
        return res.status(500).json({
          success: false,
          error: { message: 'Failed to update vocabulary progress' }
        });
      }

      const { data: updatedRow, error: fetchUpdatedError } = await db
        .from(TABLES.USER_VOCABULARY)
        .select(`
          vocabulary_id,
          learned,
          last_practiced,
          next_review_date,
          repetition_stage,
          vocabulary:vocabulary_id (
            french,
            english,
            example,
            level,
            category,
            pronunciation
          )
        `)
        .eq('user_id', userId)
        .eq('vocabulary_id', vocabularyItem.id)
        .single();

      if (fetchUpdatedError || !updatedRow) {
        return res.status(500).json({
          success: false,
          error: { message: 'Failed to fetch updated vocabulary progress' }
        });
      }

      const result = mapProgressItem(updatedRow as UserVocabularyRow);

      return res.status(200).json({
        success: true,
        data: result,
        progress: result
      });
    } catch (error) {
      console.error('Error updating vocabulary progress:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: { message: 'Method not allowed' }
  });
}
