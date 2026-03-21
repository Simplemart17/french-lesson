import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { Conversation } from '@/services/api/conversationApiService';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { getUserId } from '@/utils/auth';

interface ConversationTemplateRow {
  id: string;
  title: string;
  initial_message: string;
  level: string;
}

interface ConversationRow {
  id: string;
  title: string | null;
  scenario: string | null;
  created_at: string;
  updated_at: string;
}

interface MessageRow {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

function mapLevelToDb(level: string): string[] {
  switch (level) {
    case 'beginner':
      return ['A1', 'A2'];
    case 'intermediate':
      return ['B1', 'B2'];
    case 'advanced':
      return ['C1', 'C2'];
    default:
      return [level];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Conversation>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    const { topic, level } = req.body as { topic?: string; level?: string };

    if (!topic || !level) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Topic and level are required'
        }
      });
    }

    const db = supabaseAdmin ?? supabase;

    const { data: templates, error: templateError } = await db
      .from(TABLES.CONVERSATION_TEMPLATES)
      .select('id,title,initial_message,level')
      .in('level', mapLevelToDb(level))
      .order('created_at', { ascending: true })
      .limit(50);

    if (templateError) {
      throw new Error(`Failed to load conversation templates: ${templateError.message}`);
    }

    const normalizedTopic = topic.toLowerCase();
    const selectedTemplate = ((templates || []) as ConversationTemplateRow[]).find((template) =>
      template.title.toLowerCase().includes(normalizedTopic) || normalizedTopic.includes(template.title.toLowerCase())
    ) || ((templates || [])[0] as ConversationTemplateRow | undefined);

    const conversationTitle = selectedTemplate?.title || topic;
    const initialMessage = selectedTemplate?.initial_message || 'Bonjour ! Pratiquons le francais ensemble.';

    const { data: conversationRow, error: conversationError } = await db
      .from(TABLES.CONVERSATIONS)
      .insert({
        user_id: userId,
        title: conversationTitle,
        scenario: topic,
        language: 'fr'
      })
      .select('id,title,scenario,created_at,updated_at')
      .single();

    if (conversationError || !conversationRow) {
      throw new Error(`Failed to create conversation: ${conversationError?.message || 'Unknown error'}`);
    }

    const { data: messageRow, error: messageError } = await db
      .from(TABLES.MESSAGES)
      .insert({
        conversation_id: conversationRow.id,
        role: 'assistant',
        content: initialMessage
      })
      .select('id,role,content,created_at')
      .single();

    if (messageError || !messageRow) {
      throw new Error(`Failed to create initial message: ${messageError?.message || 'Unknown error'}`);
    }

    const typedConversation = conversationRow as ConversationRow;
    const typedMessage = messageRow as MessageRow;

    const response: Conversation = {
      id: typedConversation.id,
      topic: typedConversation.scenario || typedConversation.title || topic,
      level,
      messages: [
        {
          id: typedMessage.id,
          conversationId: typedConversation.id,
          role: typedMessage.role,
          content: typedMessage.content,
          createdAt: typedMessage.created_at
        }
      ],
      createdAt: typedConversation.created_at,
      updatedAt: typedConversation.updated_at
    };

    return res.status(200).json({
      success: true,
      data: response,
      conversation: response
    });
  } catch (error) {
    console.error('Error starting conversation:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
