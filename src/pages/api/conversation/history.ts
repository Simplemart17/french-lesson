import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { Conversation } from '@/services/api/conversationApiService';
import { authMiddleware } from '../../../utils/authMiddleware';
import { prisma } from '../../../lib/prisma';
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
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1 // Get only the last message for preview
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    });

    // Transform to API format
    const conversationHistory: Conversation[] = conversations.map(conv => ({
      id: conv.id,
      topic: conv.title,
      level: 'beginner', // Default level since it's not in the schema
      messages: conv.messages.map(msg => ({
        id: msg.id.toString(),
        conversationId: msg.conversationId,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: msg.timestamp.toISOString()
      })),
      createdAt: conv.startedAt.toISOString(),
      updatedAt: conv.lastMessageAt.toISOString()
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

// Mock conversation history for fallback (if needed)
const mockConversationHistory: Conversation[] = [
  {
    id: 'conv-1',
    topic: 'At the Restaurant',
    level: 'beginner',
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        role: 'assistant',
        content: 'Bonjour ! Bienvenue au restaurant. Que voulez-vous commander aujourd\'hui ?',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        role: 'user',
        content: 'Je voudrais une salade, s\'il vous plaît.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 1000).toISOString()
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        role: 'assistant',
        content: 'Très bien. Et comme boisson ?',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2000).toISOString()
  },
  {
    id: 'conv-2',
    topic: 'Asking for Directions',
    level: 'beginner',
    messages: [
      {
        id: 'msg-4',
        conversationId: 'conv-2',
        role: 'assistant',
        content: 'Bonjour ! Vous semblez perdu. Puis-je vous aider à trouver votre chemin ?',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-5',
        conversationId: 'conv-2',
        role: 'user',
        content: 'Oui, s\'il vous plaît. Où est la gare ?',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1000).toISOString()
      },
      {
        id: 'msg-6',
        conversationId: 'conv-2',
        role: 'assistant',
        content: 'La gare est tout droit, puis tournez à gauche au feu rouge. C\'est à environ 10 minutes à pied.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2000).toISOString()
  }
];

export default authMiddleware(handler);
