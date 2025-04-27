import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { Conversation, Message } from '@/services/api/conversationApiService';

// Mock conversation contexts for new conversations
const conversationContexts: Record<string, string> = {
  restaurant: 'You are ordering food at a French restaurant',
  shopping: 'You are shopping for clothes in a French store',
  travel: 'You are asking for directions in a French city',
  doctor: 'You are explaining symptoms to a French doctor',
  smalltalk: 'You are having a casual conversation in French'
};

// Mock assistant messages for new conversations
const initialMessages: Record<string, string> = {
  restaurant: 'Bonjour ! Bienvenue au restaurant. Que voulez-vous commander aujourd\'hui ?',
  shopping: 'Bonjour ! Puis-je vous aider à trouver quelque chose aujourd\'hui ?',
  travel: 'Bonjour ! Vous semblez perdu. Puis-je vous aider à trouver votre chemin ?',
  doctor: 'Bonjour ! Qu\'est-ce qui vous amène aujourd\'hui ? Quels sont vos symptômes ?',
  smalltalk: 'Bonjour ! Comment allez-vous aujourd\'hui ? Quel temps fait-il chez vous ?'
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Conversation>>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    // Get request body
    const { topic, level } = req.body;
    
    // Validate input
    if (!topic || !level) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Topic and level are required'
        }
      });
    }
    
    // Determine context based on topic
    let context = '';
    let initialMessage = '';
    
    // Try to match topic with predefined contexts
    for (const [key, value] of Object.entries(conversationContexts)) {
      if (topic.toLowerCase().includes(key)) {
        context = value;
        initialMessage = initialMessages[key] || 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
        break;
      }
    }
    
    // If no match found, use a generic context
    if (!context) {
      context = `You are having a conversation in French about ${topic}`;
      initialMessage = 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
    }
    
    // Create a new conversation
    const now = new Date().toISOString();
    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      topic,
      level,
      messages: [
        {
          id: `msg-${Date.now()}`,
          conversationId: `conv-${Date.now()}`,
          role: 'assistant',
          content: initialMessage,
          createdAt: now
        }
      ],
      createdAt: now,
      updatedAt: now
    };
    
    // Return success response
    return res.status(200).json({
      success: true,
      data: conversation
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
