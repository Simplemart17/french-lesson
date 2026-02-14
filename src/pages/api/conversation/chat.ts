import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { ApiResponse } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { getOpenAIClient } from '@/utils/openaiClient';
import { Conversation } from '@/services/api/conversationApiService';

interface ConversationData {
  conversationId: string;
  message: string;
  context: string;
  history: ChatMessage[];
}

interface ChatMessage {
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
    conversation_id?: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
  }>;
}

function mapConversation(row: ConversationRow, previewOnly: boolean): Conversation {
  const sortedMessages = (row.messages || [])
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .filter((message) => message.role === 'user' || message.role === 'assistant');

  const selectedMessages = previewOnly ? sortedMessages.slice(-1) : sortedMessages;

  return {
    id: row.id,
    topic: row.scenario || row.title || 'General Conversation',
    level: 'beginner',
    messages: selectedMessages.map((message) => ({
      id: message.id,
      conversationId: message.conversation_id || row.id,
      role: message.role as 'user' | 'assistant',
      content: message.content,
      createdAt: message.created_at
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function generateAssistantReply(message: string, context: string, history: ChatMessage[]): Promise<string> {
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
  res: NextApiResponse<ApiResponse<ConversationData | Conversation | Conversation[]>>
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

      const history: ChatMessage[] = (historyRows || []).map((item) => ({
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

      const fullHistory: ChatMessage[] = [
        ...history,
        {
          id: assistantMessage.id,
          role: assistantMessage.role,
          content: assistantMessage.content,
          timestamp: assistantMessage.created_at
        }
      ];

      const payload = {
        conversationId: finalConversationId,
        message: assistantContent,
        context: conversationContext,
        history: fullHistory
      };

      return res.status(200).json({
        success: true,
        data: payload,
        chat: payload
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
            messages:${TABLES.MESSAGES}(id,conversation_id,role,content,created_at)
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

        const conversation = mapConversation(data as ConversationRow, false);

        return res.status(200).json({
          success: true,
          data: conversation,
          conversation
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
          messages:${TABLES.MESSAGES}(id,conversation_id,role,content,created_at)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch conversations: ${error.message}`);
      }

      const conversations = ((data || []) as ConversationRow[]).map((row) => mapConversation(row, true));

      return res.status(200).json({
        success: true,
        data: conversations,
        conversations
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
