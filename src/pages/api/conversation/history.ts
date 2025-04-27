import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { Conversation } from '@/services/api/conversationApiService';

// Mock conversation history
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

export default function handler(
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
    // Return success response
    return res.status(200).json({
      success: true,
      data: mockConversationHistory
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
