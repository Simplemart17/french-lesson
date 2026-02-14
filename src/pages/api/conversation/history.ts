import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { Conversation } from '@/services/api/conversationApiService';
import { authMiddleware } from '../../../utils/authMiddleware';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { getUserId } from '@/utils/auth';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Conversation[]>>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
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
        error: { message: 'User not authenticated' }
      });
    }

    // Get conversations from database
    const db = supabaseAdmin ?? supabase;
    const { data: conversations, error } = await db
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
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

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

    // Transform to API format
    const conversationHistory: Conversation[] = ((conversations || []) as ConversationRow[]).map((conv) => ({
      id: conv.id,
      topic: conv.scenario || conv.title || 'General Conversation',
      level: 'beginner', // Default level since it's not in the schema
      messages: (conv.messages || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 1) // Get only the last message for preview
        .map((msg) => ({
          id: msg.id,
          conversationId: msg.conversation_id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.created_at
        })),
      createdAt: conv.created_at,
      updatedAt: conv.updated_at
    }));

    // If no conversations exist, return empty array
    if (conversationHistory.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      data: conversationHistory
    });

  } catch (error) {
    console.error('Error in conversation history API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}

export default authMiddleware(handler);
