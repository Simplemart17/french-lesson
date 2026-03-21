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

  // GET request to retrieve user's vocabulary
  if (req.method === 'GET') {
    try {
      const { data: vocabularyItems, error } = await db
        .from(TABLES.USER_VOCABULARY)
        .select(`
          *,
          vocabulary:vocabulary_id(*)
        `)
        .eq('user_id', userId)
        .order('last_practiced', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return res.status(200).json({
        success: true,
        data: vocabularyItems || [],
        vocabulary: vocabularyItems || []
      });
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch vocabulary' }
      });
    }
  }
  
  // POST request to add vocabulary to user's list
  if (req.method === 'POST') {
    try {
      const { vocabularyId, learned } = req.body;

      if (!vocabularyId) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required vocabulary ID' }
        });
      }

      // Check if vocabulary exists
      const { data: vocabularyExists, error: vocabError } = await db
        .from(TABLES.VOCABULARY)
        .select('id')
        .eq('id', vocabularyId)
        .single();

      if (vocabError || !vocabularyExists) {
        return res.status(404).json({
          success: false,
          error: { message: 'Vocabulary not found' }
        });
      }

      // Check if user vocabulary already exists
      const { data: existingUserVocab } = await db
        .from(TABLES.USER_VOCABULARY)
        .select('*')
        .eq('user_id', userId)
        .eq('vocabulary_id', vocabularyId)
        .maybeSingle();

      let userVocabulary;
      const now = new Date().toISOString();

      if (existingUserVocab) {
        // Update existing record
        const { data, error } = await db
          .from(TABLES.USER_VOCABULARY)
          .update({
            learned: learned !== undefined ? learned : existingUserVocab.learned,
            last_practiced: now
          })
          .eq('user_id', userId)
          .eq('vocabulary_id', vocabularyId)
          .select()
          .single();

        if (error) {
          throw new Error(`Update error: ${error.message}`);
        }
        userVocabulary = data;
      } else {
        // Create new record
        const { data, error } = await db
          .from(TABLES.USER_VOCABULARY)
          .insert({
            user_id: userId,
            vocabulary_id: vocabularyId,
            learned: learned || false,
            last_practiced: now,
            repetition_stage: 0
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Insert error: ${error.message}`);
        }
        userVocabulary = data;
      }

      return res.status(201).json({
        success: true,
        data: userVocabulary,
        vocabulary: userVocabulary
      });
    } catch (error) {
      console.error('Error managing vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to manage vocabulary' }
      });
    }
  }
  
  // DELETE request to remove vocabulary from user's list
  if (req.method === 'DELETE') {
    try {
      const { vocabularyId } = req.body;

      if (!vocabularyId) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required vocabulary ID' }
        });
      }

      // Delete the user vocabulary entry
      const { error } = await db
        .from(TABLES.USER_VOCABULARY)
        .delete()
        .eq('user_id', userId)
        .eq('vocabulary_id', vocabularyId);

      if (error) {
        throw new Error(`Delete error: ${error.message}`);
      }

      return res.status(200).json({
        success: true,
        data: { message: 'Vocabulary removed successfully' },
        message: 'Vocabulary removed successfully'
      });
    } catch (error) {
      console.error('Error removing vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to remove vocabulary' }
      });
    }
  }
  
  return res.status(405).json({ 
    success: false, 
    error: { message: 'Method not allowed' } 
  });
}

export default authMiddleware(handler);
