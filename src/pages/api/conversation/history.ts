import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, DatabaseConversation, DatabaseMessage } from '@/types/api';
import { Conversation } from '@/services/api/conversationApiService';
import { authMiddleware } from '../../../utils/authMiddleware';
import { supabase, TABLES } from '@/lib/supabase';
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
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    // Get conversations from database
    const { data: conversations, error } = await supabase
      .from(TABLES.CONVERSATIONS)
      .select(`
        *,
        messages:${TABLES.MESSAGES}(*)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    // Transform to API format
    const conversationHistory: Conversation[] = (conversations || []).map((conv: DatabaseConversation) => ({
      id: conv.id,
      topic: conv.title,
      level: 'beginner', // Default level since it's not in the schema
      messages: (conv.messages || [])
        .sort((a: DatabaseMessage, b: DatabaseMessage) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 1) // Get only the last message for preview
        .map((msg: DatabaseMessage) => ({
          id: msg.id.toString(),
          conversationId: msg.conversationId,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          createdAt: msg.timestamp
        })),
      createdAt: conv.startedAt,
      updatedAt: conv.lastMessageAt
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
