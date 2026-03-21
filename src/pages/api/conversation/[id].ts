import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { Conversation } from '@/services/api/conversationApiService';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { getUserId } from '@/utils/auth';

interface ConversationRow {
  id: string;
  title: string | null;
  scenario: string | null;
  created_at: string;
  updated_at: string;
  messages?: Array<{
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Conversation>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    const db = supabaseAdmin ?? supabase;
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized'
        }
      });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid conversation ID'
        }
      });
    }

    const { data, error } = await db
      .from(TABLES.CONVERSATIONS)
      .select(`
        id,
        title,
        scenario,
        created_at,
        updated_at,
        messages:${TABLES.MESSAGES}(
          id,
          conversation_id,
          role,
          content,
          created_at
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Conversation with ID ${id} not found`
        }
      });
    }

    const row = data as ConversationRow;
    const messages = (row.messages || [])
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((message) => ({
        id: message.id,
        conversationId: message.conversation_id,
        role: message.role,
        content: message.content,
        createdAt: message.created_at
      }));

    const conversation: Conversation = {
      id: row.id,
      topic: row.scenario || row.title || 'General Conversation',
      level: 'beginner',
      messages,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    return res.status(200).json({
      success: true,
      data: conversation,
      conversation
    });
  } catch (error) {
    console.error('Error in conversation API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
