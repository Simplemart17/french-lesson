import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { ApiResponse } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { getOpenAIClient } from '@/utils/openaiClient';

interface ConversationData {
  conversationId: string;
  message: string;
  context: string;
  history: Message[];
}

interface Message {
  id?: string;
  role: string;
  content: string;
  timestamp?: string;
}

interface ConversationRow {
  id: string;
  title: string | null;
  scenario: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  messages?: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
  }>;
}

async function generateAssistantReply(message: string, context: string, history: Message[]): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const messages = [
      {
        role: 'system' as const,
        content: `You are a helpful French tutor. Keep replies concise, natural, and educational. Context: ${context}.`
      },
      ...history.slice(-8).map((item) => ({
        role: (item.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: item.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages
    });

    return completion.choices[0]?.message?.content?.trim() || 'Pouvez-vous reformuler votre phrase ?';
  } catch {
    return 'Merci pour votre message. Continuons la conversation en francais.';
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ConversationData | ConversationRow | ConversationRow[]>>
) {
  if (!(await isAuthenticated(req))) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const userId = await getUserId(req);
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const db = supabaseAdmin ?? supabase;

  if (req.method === 'POST') {
    try {
      const { message, conversationId, context = 'general' } = req.body as {
        message?: string;
        conversationId?: string;
        context?: string;
      };

      if (!message) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Message is required'
          }
        });
      }

      let activeConversationId = conversationId;
      let conversationContext = context;

      if (!activeConversationId) {
        const { data: createdConversation, error: createConversationError } = await db
          .from(TABLES.CONVERSATIONS)
          .insert({
            user_id: userId,
            title: `French conversation: ${context}`,
            scenario: context,
            language: 'fr'
          })
          .select('id,scenario')
          .single();

        if (createConversationError || !createdConversation) {
          throw new Error(`Failed to create conversation: ${createConversationError?.message || 'Unknown error'}`);
        }

        activeConversationId = createdConversation.id;
        conversationContext = createdConversation.scenario || context;
      } else {
        const { data: existingConversation, error: existingConversationError } = await db
          .from(TABLES.CONVERSATIONS)
          .select('id,scenario,user_id')
          .eq('id', activeConversationId)
          .eq('user_id', userId)
          .single();

        if (existingConversationError || !existingConversation) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Conversation not found'
            }
          });
        }

        conversationContext = existingConversation.scenario || context;
      }

      const now = new Date().toISOString();
      const finalConversationId = activeConversationId as string;
      const { error: saveUserMessageError } = await db
        .from(TABLES.MESSAGES)
        .insert({
          conversation_id: finalConversationId,
          role: 'user',
          content: message,
          created_at: now
        });

      if (saveUserMessageError) {
        throw new Error(`Failed to save user message: ${saveUserMessageError.message}`);
      }

      const { data: historyRows, error: historyError } = await db
        .from(TABLES.MESSAGES)
        .select('id,role,content,created_at')
        .eq('conversation_id', finalConversationId)
        .order('created_at', { ascending: true });

      if (historyError) {
        throw new Error(`Failed to fetch conversation history: ${historyError.message}`);
      }

      const history: Message[] = (historyRows || []).map((item) => ({
        id: item.id,
        role: item.role,
        content: item.content,
        timestamp: item.created_at
      }));

      const assistantContent = await generateAssistantReply(message, conversationContext, history);

      const { data: assistantMessage, error: saveAssistantMessageError } = await db
        .from(TABLES.MESSAGES)
        .insert({
          conversation_id: finalConversationId,
          role: 'assistant',
          content: assistantContent,
          created_at: new Date().toISOString()
        })
        .select('id,role,content,created_at')
        .single();

      if (saveAssistantMessageError || !assistantMessage) {
        throw new Error(`Failed to save assistant message: ${saveAssistantMessageError?.message || 'Unknown error'}`);
      }

      await db
        .from(TABLES.CONVERSATIONS)
        .update({ updated_at: new Date().toISOString() })
        .eq('id', finalConversationId);

      const fullHistory: Message[] = [
        ...history,
        {
          id: assistantMessage.id,
          role: assistantMessage.role,
          content: assistantMessage.content,
          timestamp: assistantMessage.created_at
        }
      ];

      return res.status(200).json({
        success: true,
        data: {
          conversationId: finalConversationId,
          message: assistantContent,
          context: conversationContext,
          history: fullHistory
        }
      });
    } catch (error) {
      console.error('Conversation error:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (id && typeof id === 'string') {
        const { data, error } = await db
          .from(TABLES.CONVERSATIONS)
          .select(`
            id,
            user_id,
            title,
            scenario,
            created_at,
            updated_at,
            messages:${TABLES.MESSAGES}(id,role,content,created_at)
          `)
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (error || !data) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Conversation not found'
            }
          });
        }

        return res.status(200).json({
          success: true,
          data
        });
      }

      const { data, error } = await db
        .from(TABLES.CONVERSATIONS)
        .select(`
          id,
          user_id,
          title,
          scenario,
          created_at,
          updated_at,
          messages:${TABLES.MESSAGES}(id,role,content,created_at)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch conversations: ${error.message}`);
      }

      const conversations = (data || []).map((conv) => ({
        ...conv,
        messages: (conv.messages || [])
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 1)
      }));

      return res.status(200).json({
        success: true,
        data: conversations
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: {
      message: 'Method not allowed'
    }
  });
}
