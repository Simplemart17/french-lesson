import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ApiResponse, Conversation, Message } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import aiService from '@/services/aiService';

// Initialize Prisma client
const prisma = new PrismaClient();

// Mock conversation contexts for new conversations
const conversationContexts = {
  restaurant: 'You are ordering food at a French restaurant',
  shopping: 'You are shopping for clothes in a French store',
  travel: 'You are asking for directions in a French city',
  doctor: 'You are explaining symptoms to a French doctor',
  smalltalk: 'You are having a casual conversation in French'
};



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

      let conversation: any;
      let messages: any[] = [];

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

        // Create a new conversation in the database
        const contextDescription = conversationContexts[context as keyof typeof conversationContexts];
        conversation = await prisma.conversation.create({
          data: {
            userId: userId,
            title: `French conversation: ${context}`,
            context: contextDescription,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });

        // Create the initial user message
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: 'user',
            content: message,
            createdAt: new Date()
          }
        });

        messages = [{ role: 'user', content: message }];
      } else {
        // Get existing conversation
        conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!conversation) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Conversation not found'
            }
          });
        }

        // Check if the conversation belongs to the user
        if (conversation.userId !== userId) {
          return res.status(403).json({
            success: false,
            error: {
              message: 'Access denied'
            }
          });
        }

        // Add user message to conversation
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: 'user',
            content: message,
            createdAt: new Date()
          }
        });

        // Update conversation's updatedAt timestamp
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() }
        });

        messages = [...conversation.messages, { role: 'user', content: message }];
      }

      // Generate AI response using aiService
      // Convert messages to the format expected by the AI service
      const messageHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

      const aiResponse = await aiService.generateConversation(
        message,
        conversation.context,
        messageHistory
      );

      // Add AI response to conversation
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: 'assistant',
          content: aiResponse,
          createdAt: new Date()
        }
      });

      // Get updated messages
      messages = [...messages, { role: 'assistant', content: aiResponse }];

      return res.status(200).json({
        success: true,
        data: {
          conversationId: conversation.id,
          message: aiResponse,
          context: conversation.context,
          history: messages
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
    try {
      // Get conversation history or list of conversations
      const { id } = req.query;

      if (id && typeof id === 'string') {
        // Get specific conversation
        const conversation = await prisma.conversation.findUnique({
          where: { id },
          include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!conversation) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Conversation not found'
            }
          });
        }

        // Check if the conversation belongs to the user
        if (conversation.userId !== userId) {
          return res.status(403).json({
            success: false,
            error: {
              message: 'Access denied'
            }
          });
        }

        return res.status(200).json({
          success: true,
          data: conversation
        });
      } else {
        // Get all user's conversations
        const conversations = await prisma.conversation.findMany({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1 // Just get the last message for preview
            }
          }
        });

        return res.status(200).json({
          success: true,
          data: conversations
        });
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
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