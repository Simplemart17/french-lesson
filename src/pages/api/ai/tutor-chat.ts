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
    case 'A1':
    case 'beginner':
      return 'The learner is a beginner (A1). Use very simple French: present tense, short sentences, high-frequency vocabulary. Always add an English translation in parentheses after each French sentence.';
    case 'A2':
      return 'The learner is elementary (A2). Use simple French with common past and future tenses. Translate only difficult phrases into English in parentheses.';
    case 'B1':
    case 'intermediate':
      return 'The learner is intermediate (B1). Use natural French of moderate complexity. Explain corrections in simple French; use English only when the learner is clearly stuck.';
    case 'B2':
      return 'The learner is upper-intermediate (B2). Use natural, idiomatic French throughout and explain corrections in French. Introduce nuanced vocabulary and connectors.';
    case 'C1':
    case 'advanced':
      return 'The learner is advanced (C1). Use sophisticated French with idioms and register nuance. Challenge the learner, point out anglicisms and subtle errors, and vary registers.';
    case 'C2':
      return 'The learner is at mastery level (C2). Converse entirely in rich, native-level French — irony, wordplay, literary references welcome. Focus corrections on the finest nuances of style and register.';
    default:
      return 'Use simple, everyday vocabulary and basic grammar structures.';
  }
}

interface LearnerContext {
  level: string;
  goals: string[];
  weakAreas: string[];
}

// Pull the learner's real profile and recent weak spots so the tutor adapts
async function getLearnerContext(db: typeof supabase, userId: string, fallbackLevel: string): Promise<LearnerContext> {
  const context: LearnerContext = { level: fallbackLevel, goals: [], weakAreas: [] };
  try {
    const [profileResult, sessionsResult, examsResult] = await Promise.all([
      db.from(TABLES.USERS).select('level, learning_goals').eq('id', userId).single(),
      db.from(TABLES.PRACTICE_SESSIONS).select('type, score').eq('user_id', userId)
        .order('created_at', { ascending: false }).limit(15),
      db.from(TABLES.EXAM_RESULTS).select('module, percentage').eq('user_id', userId)
        .order('completed_at', { ascending: false }).limit(5)
    ]);

    if (profileResult.data?.level) {
      context.level = profileResult.data.level as string;
    }
    if (Array.isArray(profileResult.data?.learning_goals)) {
      context.goals = (profileResult.data.learning_goals as string[]).slice(0, 5);
    }

    const weak = new Set<string>();
    for (const session of (sessionsResult.data || []) as Array<{ type: string; score: number | null }>) {
      if (typeof session.score === 'number' && session.score < 60) weak.add(session.type);
    }
    for (const exam of (examsResult.data || []) as Array<{ module: string; percentage: number | null }>) {
      if (typeof exam.percentage === 'number' && exam.percentage < 60) weak.add(exam.module);
    }
    context.weakAreas = Array.from(weak).slice(0, 5);
  } catch (err) {
    console.error('Failed to load learner context (using defaults):', err);
  }
  return context;
}

// Escape ilike wildcards so a flagged phrase containing % or _ matches literally
const escapeIlike = (value: string) => value.replace(/[%_]/g, '\\$&');

// Upsert tutor-flagged words into vocabulary + the learner's SRS deck.
// Existing deck entries are left untouched so review stages are preserved.
// Words are processed in parallel so the chat reply is delayed by at most
// one word's worth of round trips, not the sum of all of them.
async function saveEncounteredVocabulary(
  db: typeof supabase,
  userId: string,
  level: string,
  words: Array<{ french?: string; english?: string; example?: string }>
): Promise<void> {
  try {
    await Promise.all(words.map(async (word) => {
      const french = word.french?.trim();
      const english = word.english?.trim();
      if (!french || !english) return;

      const { data: existing } = await db
        .from(TABLES.VOCABULARY)
        .select('id')
        .ilike('french', escapeIlike(french))
        .maybeSingle();

      let vocabularyId = existing?.id as string | undefined;
      if (!vocabularyId) {
        const { data: inserted } = await db
          .from(TABLES.VOCABULARY)
          .insert({
            french,
            english,
            example: word.example?.trim() || null,
            level,
            category: 'conversation'
          })
          .select('id')
          .single();
        vocabularyId = inserted?.id as string | undefined;
      }
      if (!vocabularyId) return;

      await db
        .from(TABLES.USER_VOCABULARY)
        .upsert(
          {
            user_id: userId,
            vocabulary_id: vocabularyId,
            learned: false,
            next_review_date: new Date().toISOString(),
            repetition_stage: 0
          },
          { onConflict: 'user_id,vocabulary_id', ignoreDuplicates: true }
        );
    }));
  } catch (err) {
    console.error('Failed to save encountered vocabulary:', err);
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

    const [historyResult, learner] = await Promise.all([
      db
        .from(TABLES.MESSAGES)
        .select('id,conversation_id,role,content,created_at')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true }),
      getLearnerContext(db, userId, level)
    ]);

    if (historyResult.error) {
      throw new Error(`Failed to fetch conversation history: ${historyResult.error.message}`);
    }

    const messageHistory = (historyResult.data || []) as MessageRow[];
    const learnerNotes = [
      learner.goals.length > 0 ? `The learner's stated goals: ${learner.goals.join(', ')}.` : '',
      learner.weakAreas.length > 0
        ? `Recent weak areas to gently work into the conversation: ${learner.weakAreas.join(', ')}.`
        : ''
    ].filter(Boolean).join('\n');

    const openai = getOpenAIClient();

    const openAiMessages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a friendly and helpful French language tutor.

${levelInstructions(learner.level)}
${learnerNotes}

For grammar or vocabulary mistakes in the user's French, provide gentle corrections.
If the user writes in English, respond in both French and English.
If the user writes in French, respond primarily in French with occasional English explanations.
Keep responses focused and educational.

If you find any corrections to make in the user's French, include them at the very end of your response in the following format (after your normal response text):
<!-- CORRECTIONS_JSON: [{"original": "what the user wrote", "correction": "the correct form", "explanation": "brief explanation"}] -->
Only include this delimiter if there are actual corrections. Do not mention this format to the user.

Additionally, if this exchange used up to 3 French words or short phrases the learner may not know yet (from your reply or their corrections), append:
<!-- VOCAB_JSON: [{"french": "the word", "english": "translation", "example": "a short example sentence"}] -->
Only genuinely useful vocabulary at or slightly above the learner's level; omit the delimiter when there is nothing worth saving. Do not mention this format to the user.`
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

    // Extract vocabulary the tutor flagged and feed it into the learner's SRS deck
    const vocabDelimiterRegex = /<!-- VOCAB_JSON:\s*([\s\S]*?)\s*-->/;
    const vocabMatch = vocabDelimiterRegex.exec(cleanResponse);
    if (vocabMatch) {
      cleanResponse = cleanResponse.replace(vocabDelimiterRegex, '').trim();
      try {
        const words = JSON.parse(vocabMatch[1]) as Array<{ french?: string; english?: string; example?: string }>;
        if (Array.isArray(words)) {
          await saveEncounteredVocabulary(db, userId, learner.level, words.slice(0, 3));
        }
      } catch (e) {
        console.error('Failed to parse vocab JSON from AI response:', e);
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
