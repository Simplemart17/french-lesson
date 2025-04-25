import { NextApiRequest, NextApiResponse } from 'next';
import { 
  createConversation, 
  getConversation, 
  getUserConversations,
  addMessageToConversation
} from '@/utils/mockDb';
import { ApiResponse, Conversation, Message } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';

// Mock conversation contexts for new conversations
const conversationContexts = {
  restaurant: 'You are ordering food at a French restaurant',
  shopping: 'You are shopping for clothes in a French store',
  travel: 'You are asking for directions in a French city',
  doctor: 'You are explaining symptoms to a French doctor',
  smalltalk: 'You are having a casual conversation in French'
};

// Mock AI response generator
function generateAIResponse(message: string, context: string): string {
  // In a real app, this would call an AI model
  // For this mock, we'll return some simple responses based on context
  
  // Make simple responses based on the context and last message from user
  const contextType = context.toLowerCase();
  const userMessageLower = message.toLowerCase();
  
  // Default responses for different contexts
  if (contextType.includes('restaurant')) {
    if (userMessageLower.includes('commander') || userMessageLower.includes('menu')) {
      return 'Bien sûr ! Nous avons du bœuf bourguignon, du coq au vin, et des crêpes aujourd\'hui. Qu\'est-ce qui vous ferait plaisir ?';
    } else if (userMessageLower.includes('bonjour') || userMessageLower.includes('salut')) {
      return 'Bonjour ! Bienvenue à notre restaurant. Puis-je prendre votre commande ?';
    } else {
      return 'D\'accord. Souhaitez-vous commander un dessert ?';
    }
  } else if (contextType.includes('shopping')) {
    if (userMessageLower.includes('taille') || userMessageLower.includes('size')) {
      return 'Nous avons des tailles S, M, L et XL. Quelle taille cherchez-vous ?';
    } else if (userMessageLower.includes('prix') || userMessageLower.includes('coûte')) {
      return 'Cet article coûte 45 euros. Nous avons aussi des promotions sur la collection de l\'an dernier.';
    } else {
      return 'Cette couleur vous va très bien ! Voulez-vous l\'essayer ?';
    }
  } else if (contextType.includes('travel')) {
    if (userMessageLower.includes('gare') || userMessageLower.includes('train')) {
      return 'La gare est tout droit puis à gauche après le parc. C\'est à environ 10 minutes à pied.';
    } else if (userMessageLower.includes('musée') || userMessageLower.includes('museum')) {
      return 'Le musée est fermé le lundi. Les horaires d\'ouverture sont de 9h à 18h du mardi au dimanche.';
    } else {
      return 'Je vous conseille de prendre le métro, c\'est plus rapide qu\'un bus à cette heure-ci.';
    }
  } else if (contextType.includes('doctor')) {
    return 'Je comprends. Depuis combien de temps avez-vous ces symptômes ?';
  } else {
    // Default small talk responses
    if (userMessageLower.includes('bonjour') || userMessageLower.includes('salut')) {
      return 'Bonjour ! Comment allez-vous aujourd\'hui ?';
    } else if (userMessageLower.includes('merci')) {
      return 'Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?';
    } else {
      return 'C\'est très intéressant. Parlez-moi plus de vos expériences avec la langue française.';
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ 
      success: false, 
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const userId = getUserId(req);

  if (req.method === 'POST') {
    try {
      const { message, conversationId, context } = req.body;

      if (!message) {
        return res.status(400).json({ 
          success: false, 
          error: {
            message: 'Message is required'
          }
        });
      }

      let conversation: Conversation | undefined;

      // Start a new conversation if no ID provided
      if (!conversationId) {
        if (!context || !conversationContexts[context as keyof typeof conversationContexts]) {
          return res.status(400).json({ 
            success: false, 
            error: {
              message: 'Valid conversation context is required for new conversations'
            }
          });
        }

        // Create a new conversation
        const contextDescription = conversationContexts[context as keyof typeof conversationContexts];
        conversation = createConversation(
          userId,
          `French conversation: ${context}`, // Title
          contextDescription, // Context description
          message // Initial message
        );
      } else {
        // Get existing conversation
        conversation = getConversation(conversationId);
        
        if (!conversation) {
          return res.status(404).json({ 
            success: false, 
            error: {
              message: 'Conversation not found'
            }
          });
        }
        
        // Add user message to conversation
        conversation = addMessageToConversation(conversationId, {
          role: 'user',
          content: message
        });
      }
      
      if (!conversation) {
        return res.status(500).json({ 
          success: false, 
          error: {
            message: 'Failed to update conversation'
          }
        });
      }
      
      // Generate AI response
      const aiMessage = generateAIResponse(message, conversation.context);
      
      // Add AI response to conversation
      conversation = addMessageToConversation(conversation.id, {
        role: 'assistant',
        content: aiMessage
      });
      
      return res.status(200).json({
        success: true,
        data: {
          conversationId: conversation?.id,
          message: aiMessage,
          context: conversation?.context,
          history: conversation?.messages
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
  } else if (req.method === 'GET') {
    // Get conversation history or list of conversations
    const { id } = req.query;
    
    if (id && typeof id === 'string') {
      // Get specific conversation
      const conversation = getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ 
          success: false, 
          error: {
            message: 'Conversation not found'
          }
        });
      }
      
      return res.status(200).json({
        success: true,
        data: conversation
      });
    } else {
      // Get all user's conversations
      const conversations = getUserConversations(userId);
      
      return res.status(200).json({
        success: true,
        data: conversations
      });
    }
  } else {
    return res.status(405).json({ 
      success: false, 
      error: {
        message: 'Method not allowed'
      }
    });
  }
} 