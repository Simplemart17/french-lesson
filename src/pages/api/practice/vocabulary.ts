import type { NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { getOpenAIClient } from '../../../utils/openaiClient';
import { ChatCompletionMessageParam } from 'openai/resources';
import { supabase, TABLES } from '../../../lib/supabase';
import { AuthenticatedRequest } from '@/types/api';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: { message: 'Method not allowed' } 
    });
  }

  // Get user ID from authenticated user
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'User not authenticated' }
    });
  }

  try {
    // Get query parameters
    const { count = '5', includeLearnedItems = 'false' } = req.query;
    const limit = parseInt(count as string, 10);
    const includeLearned = (includeLearnedItems as string) === 'true';
    
    // Fetch user's vocabulary items

    let query = supabase
      .from(TABLES.USER_VOCABULARY)
      .select(`
        *,
        vocabulary:vocabulary_id (
          id,
          french,
          english,
          pronunciation,
          category,
          level
        )
      `)
      .eq('user_id', userId)
      .order('last_practiced', { ascending: true })
      .limit(limit);

    // Add learned filter if needed
    if (!includeLearned) {
      query = query.eq('learned', false);
    }

    const { data: userVocabulary, error } = await query;

    if (error) {
      console.error('Error fetching user vocabulary:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch vocabulary items' }
      });
    }

    if (!userVocabulary || userVocabulary.length === 0) {
      const payload = {
        exercises: [],
        message: 'No vocabulary items available for practice'
      };
      return res.status(200).json({
        success: true,
        data: payload,
        ...payload
      });
    }

    // Generate practice exercises based on vocabulary
    interface UserVocabularyItem {
      vocabulary_id: string;
      vocabulary: {
        id: string;
        french: string;
        english: string;
        pronunciation?: string;
        category?: string;
        level?: string;
      };
    }
    const vocabularyItems = userVocabulary.map((item: UserVocabularyItem) => item.vocabulary);
    const exercises = await generateExercises(vocabularyItems, limit);

    // Update last_practiced for all vocabulary items
    const updatePromises = userVocabulary.map(async (item: UserVocabularyItem) => {
      const { error } = await supabase
        .from(TABLES.USER_VOCABULARY)
        .update({ last_practiced: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('vocabulary_id', item.vocabulary_id);

      if (error) {
        console.error('Error updating lastPracticed:', error);
      }
    });

    await Promise.all(updatePromises);
    
    const payload = {
      exercises,
      vocabularyItems
    };

    return res.status(200).json({
      success: true,
      data: payload,
      ...payload
    });
  } catch (error) {
    console.error('Error generating practice exercises:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to generate practice exercises' }
    });
  }
}

// Function to generate different types of exercises
interface VocabularyItem {
  id: string;
  french: string;
  english: string;
  pronunciation?: string;
  category?: string;
  level?: string;
}

async function generateExercises(vocabularyItems: VocabularyItem[], count: number) {
  try {
    // If we have OpenAI client, use it to generate more interesting exercises
    const openai = getOpenAIClient();
  
    // Prepare messages for OpenAI
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are a French language learning assistant. Generate engaging practice exercises for the following vocabulary words. Create a mix of different exercise types.`
      },
      {
        role: "user",
        content: `Generate ${count} French language exercises using these vocabulary items: ${JSON.stringify(vocabularyItems)}
        
        Format your response as JSON:
        {
          "exercises": [
            {
              "type": "multiple-choice" | "fill-in-blank" | "translation" | "matching",
              "question": "Question text",
              "options": ["option1", "option2", "option3", "option4"], (for multiple-choice and matching)
              "answer": "Correct answer",
              "vocabularyId": "ID of the vocabulary item being tested"
            }
          ]
        }`
      }
    ];
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    
    const exercises = JSON.parse(response.choices[0].message.content || '{}');
    
    return exercises.exercises;
  } catch (error) {
    console.error('Error in AI-generated exercises:', error);
    
    // Fallback to simple exercises if AI generation fails
    return vocabularyItems.slice(0, count).map(item => ({
      type: 'translation',
      question: `Translate to French: ${item.english}`,
      answer: item.french,
      vocabularyId: item.id
    }));
  }
}

export default authMiddleware(handler); 
