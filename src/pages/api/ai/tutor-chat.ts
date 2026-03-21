import type { NextApiResponse } from 'next';
import { getOpenAIClient } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';
import { AuthenticatedRequest, ChatMessage } from '@/types/api';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { recordActivity, updateUserXpAndStreak } from '@/utils/progressTracker';

interface ConversationRow {
  id: string;
  user_id: string;
  title: string | null;
  scenario: string | null;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

function levelInstructions(level: string): string {
  switch (level) {
    case 'beginner':
      return 'Use simple, everyday vocabulary and basic grammar structures. Keep sentences short and clear.';
    case 'intermediate':
      return 'Use mixed vocabulary and moderate grammar complexity. Add short explanations for corrections.';
    case 'advanced':
      return 'Use sophisticated vocabulary and natural idioms, while still being educational.';
    default:
      return 'Use simple, everyday vocabulary and basic grammar structures.';
  }
}

async function getOrCreateConversation(db: typeof supabase, userId: string, conversationId: string | undefined, message: string): Promise<ConversationRow> {
  if (conversationId) {
    const { data, error } = await db
      .from(TABLES.CONVERSATIONS)
      .select('id,user_id,title,scenario')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new Error('Conversation not found');
    }

    return data as ConversationRow;
  }

  const { data, error } = await db
    .from(TABLES.CONVERSATIONS)
    .insert({
      user_id: userId,
      title: message.slice(0, 60),
      scenario: 'French language tutoring',
      language: 'fr'
    })
    .select('id,user_id,title,scenario')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create conversation: ${error?.message || 'Unknown error'}`);
  }

  return data as ConversationRow;
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { message, conversationId, level = 'beginner' } = req.body as {
      message?: string;
      conversationId?: string;
      level?: 'beginner' | 'intermediate' | 'advanced';
    };

    if (!message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Message is required' }
      });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    const db = supabaseAdmin ?? supabase;
    const conversation = await getOrCreateConversation(db, userId, conversationId, message);

    const { error: saveUserMessageError } = await db
      .from(TABLES.MESSAGES)
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message
      });

    if (saveUserMessageError) {
      throw new Error(`Failed to save user message: ${saveUserMessageError.message}`);
    }

    const { data: historyRows, error: historyError } = await db
      .from(TABLES.MESSAGES)
      .select('id,conversation_id,role,content,created_at')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });

    if (historyError) {
      throw new Error(`Failed to fetch conversation history: ${historyError.message}`);
    }

    const messageHistory = (historyRows || []) as MessageRow[];

    const openai = getOpenAIClient();

    const openAiMessages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a friendly and helpful French language tutor.

${levelInstructions(level)}

For grammar or vocabulary mistakes in the user's French, provide gentle corrections.
If the user writes in English, respond in both French and English.
If the user writes in French, respond primarily in French with occasional English explanations.
Keep responses focused and educational.

If you find any corrections to make in the user's French, include them at the very end of your response in the following format (after your normal response text):
<!-- CORRECTIONS_JSON: [{"original": "what the user wrote", "correction": "the correct form", "explanation": "brief explanation"}] -->
Only include this delimiter if there are actual corrections. Do not mention this format to the user.`
      },
      ...messageHistory.slice(-10).map((item) => ({
        role: (item.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: item.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: openAiMessages,
      temperature: 0.7,
      max_tokens: 1000
    });

    const aiResponse = response.choices[0].message.content || '';

    // Extract structured corrections from the AI response delimiter before saving
    let corrections: Array<{ original: string; correction: string; explanation: string }> = [];
    let cleanResponse = aiResponse;
    const correctionsDelimiterRegex = /<!-- CORRECTIONS_JSON:\s*([\s\S]*?)\s*-->/;
    const delimiterMatch = correctionsDelimiterRegex.exec(aiResponse);

    if (delimiterMatch) {
      // Remove the delimiter from the visible response
      cleanResponse = aiResponse.replace(correctionsDelimiterRegex, '').trim();
      try {
        const parsed = JSON.parse(delimiterMatch[1]);
        if (Array.isArray(parsed)) {
          corrections = parsed;
        }
      } catch (e) {
        console.error('Failed to parse corrections JSON from AI response:', e);
      }
    }

    const { error: saveAssistantMessageError } = await db
      .from(TABLES.MESSAGES)
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: cleanResponse
      });

    if (saveAssistantMessageError) {
      throw new Error(`Failed to save assistant message: ${saveAssistantMessageError.message}`);
    }

    await db
      .from(TABLES.CONVERSATIONS)
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversation.id);

    // Track activity and award XP (non-blocking)
    try {
      await recordActivity(db as never, userId, 'chat', undefined, { conversationId: conversation.id });
      await updateUserXpAndStreak(db as never, userId, 5);
    } catch {
      // Non-fatal
    }

    const payload = {
      response: cleanResponse,
      conversationId: conversation.id,
      corrections: corrections.length > 0 ? corrections : undefined
    };

    return res.status(200).json({
      success: true,
      data: payload,
      ...payload
    });
  } catch (error) {
    console.error('Tutor chat error:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to generate tutor response' }
    });
  }
}

export default authMiddleware(handler);
