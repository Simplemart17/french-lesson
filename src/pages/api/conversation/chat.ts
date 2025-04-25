import type { NextApiRequest, NextApiResponse } from 'next';

// Mock middleware to verify authentication token
function isAuthenticated(req: NextApiRequest): boolean {
  const token = req.headers.authorization?.split(' ')[1];
  return token === 'mock-jwt-token';
}

// Mock conversation contexts
const conversationContexts = {
  restaurant: {
    scenario: 'You are ordering food at a French restaurant',
    aiResponses: [
      'Bonjour ! Puis-je prendre votre commande ?',
      'Voulez-vous une entrée ?',
      'Et comme plat principal ?',
      'Quelque chose à boire ?',
      'C\'est noté. Merci beaucoup !'
    ]
  },
  shopping: {
    scenario: 'You are shopping for clothes in a French store',
    aiResponses: [
      'Bonjour ! Je peux vous aider ?',
      'Quelle taille cherchez-vous ?',
      'Préférez-vous une autre couleur ?',
      'Les cabines d\'essayage sont par là.',
      'Ça vous va très bien !'
    ]
  },
  travel: {
    scenario: 'You are asking for directions in a French city',
    aiResponses: [
      'Bonjour ! Vous cherchez quelque chose ?',
      'Le musée est tout droit, puis à gauche.',
      'C\'est à environ 10 minutes à pied.',
      'Vous pouvez aussi prendre le métro.',
      'De rien, bon séjour à Paris !'
    ]
  }
};

// Track active conversations (in a real app, this would be in a database)
const activeConversations: Record<string, {
  context: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  currentStep: number;
}> = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { message, conversationId, context } = req.body;

      if (!message) {
        return res.status(400).json({ message: 'Message is required' });
      }

      // Generate conversation ID if not provided
      const currentConversationId = conversationId || `conv_${Date.now()}`;

      // Start a new conversation if no ID or context has changed
      if (!conversationId || (context && activeConversations[currentConversationId]?.context !== context)) {
        if (!context || !conversationContexts[context as keyof typeof conversationContexts]) {
          return res.status(400).json({ message: 'Valid conversation context is required' });
        }

        // Initialize a new conversation
        activeConversations[currentConversationId] = {
          context,
          messages: [],
          currentStep: 0
        };
      }

      // Get the current conversation
      const conversation = activeConversations[currentConversationId];
      
      // Add user message
      conversation.messages.push({
        role: 'user',
        content: message
      });

      // In a real app, this would call an AI model to generate a response
      // For this mock, we'll use pre-defined responses based on the conversation context
      const contextResponses = conversationContexts[conversation.context as keyof typeof conversationContexts].aiResponses;
      const aiResponse = contextResponses[conversation.currentStep % contextResponses.length];
      
      // Add AI response
      conversation.messages.push({
        role: 'assistant',
        content: aiResponse
      });

      // Increment the step counter
      conversation.currentStep += 1;
      
      return res.status(200).json({
        conversationId: currentConversationId,
        message: aiResponse,
        context: conversation.context,
        history: conversation.messages
      });
    } catch (error) {
      console.error('Conversation error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    // Get conversation history
    const { conversationId } = req.query;
    
    if (!conversationId || typeof conversationId !== 'string') {
      return res.status(400).json({ message: 'Conversation ID is required' });
    }
    
    const conversation = activeConversations[conversationId];
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    return res.status(200).json({
      conversationId,
      context: conversation.context,
      history: conversation.messages
    });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 