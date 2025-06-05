import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { getOpenAIClient } from '../../../utils/openaiClient';
import { ChatCompletionMessageParam } from 'openai/resources';
import { getSupabaseClient, TABLES } from '../../../lib/supabase';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: { message: 'Method not allowed' } 
    });
  }

  // Get user ID from authenticated user
  const userId = (req as any).user?.id;
  
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
    const supabase = getSupabaseClient();

    let query = supabase
      .from(TABLES.USER_VOCABULARY)
      .select(`
        *,
        vocabulary:vocabularyId (
          id,
          french,
          english,
          pronunciation,
          category,
          difficulty
        )
      `)
      .eq('userId', userId)
      .order('lastPracticed', { ascending: true })
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
      return res.status(200).json({
        success: true,
        data: {
          exercises: [],
          message: 'No vocabulary items available for practice'
        }
      });
    }

    // Generate practice exercises based on vocabulary
    const vocabularyItems = userVocabulary.map((item: any) => item.vocabulary);
    const exercises = await generateExercises(vocabularyItems, limit);
    
    // Update lastPracticed for all vocabulary items
    const updatePromises = userVocabulary.map(async (item: any) => {
      const { error } = await supabase
        .from(TABLES.USER_VOCABULARY)
        .update({ lastPracticed: new Date().toISOString() })
        .eq('userId', userId)
        .eq('vocabularyId', item.vocabularyId);

      if (error) {
        console.error('Error updating lastPracticed:', error);
      }
    });

    await Promise.all(updatePromises);
    
    return res.status(200).json({
      success: true,
      data: {
        exercises,
        vocabularyItems
      }
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
async function generateExercises(vocabularyItems: any[], count: number) {
  try {
    // If we have OpenAI client, use it to generate more interesting exercises
    const openai = getOpenAIClient();
    
    const exerciseTypes = [
      'multiple-choice',
      'fill-in-blank',
      'translation',
      'matching'
    ];
    
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
      model: "gpt-4-turbo",
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