import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient, TABLES } from '@/lib/supabase';
import { ApiResponse } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import aiService from '@/services/aiService';

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
        const supabase = getSupabaseClient();
        const contextDescription = conversationContexts[context as keyof typeof conversationContexts];
        const now = new Date().toISOString();

        const { data: newConversation, error: conversationError } = await supabase
          .from(TABLES.CONVERSATIONS)
          .insert({
            userId: userId,
            title: `French conversation: ${context}`,
            context: contextDescription,
            startedAt: now,
            lastMessageAt: now
          })
          .select()
          .single();

        if (conversationError || !newConversation) {
          throw new Error(`Failed to create conversation: ${conversationError?.message}`);
        }

        conversation = newConversation;

        // Create the initial user message
        const { error: messageError } = await supabase
          .from(TABLES.MESSAGES)
          .insert({
            conversationId: conversation.id,
            role: 'user',
            content: message,
            timestamp: now
          });

        if (messageError) {
          throw new Error(`Failed to create message: ${messageError.message}`);
        }

        messages = [{ role: 'user', content: message }];
      } else {
        // Get existing conversation
        const supabase = getSupabaseClient();

        const { data: existingConversation, error: fetchError } = await supabase
          .from(TABLES.CONVERSATIONS)
          .select(`
            *,
            messages:${TABLES.MESSAGES}(*)
          `)
          .eq('id', conversationId)
          .single();

        if (fetchError || !existingConversation) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Conversation not found'
            }
          });
        }

        conversation = existingConversation;

        // Check if the conversation belongs to the user
        if (conversation.userId !== userId) {
          return res.status(403).json({
            success: false,
            error: {
              message: 'Access denied'
            }
          });
        }

        const now = new Date().toISOString();

        // Add user message to conversation
        const { error: messageError } = await supabase
          .from(TABLES.MESSAGES)
          .insert({
            conversationId: conversation.id,
            role: 'user',
            content: message,
            timestamp: now
          });

        if (messageError) {
          throw new Error(`Failed to create message: ${messageError.message}`);
        }

        // Update conversation's lastMessageAt timestamp
        const { error: updateError } = await supabase
          .from(TABLES.CONVERSATIONS)
          .update({ lastMessageAt: now })
          .eq('id', conversation.id);

        if (updateError) {
          throw new Error(`Failed to update conversation: ${updateError.message}`);
        }

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
      const supabase = getSupabaseClient();
      const { error: aiMessageError } = await supabase
        .from(TABLES.MESSAGES)
        .insert({
          conversationId: conversation.id,
          role: 'assistant',
          content: typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse),
          timestamp: new Date().toISOString()
        });

      if (aiMessageError) {
        throw new Error(`Failed to create AI message: ${aiMessageError.message}`);
      }

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
        const supabase = getSupabaseClient();

        const { data: conversation, error } = await supabase
          .from(TABLES.CONVERSATIONS)
          .select(`
            *,
            messages:${TABLES.MESSAGES}(*)
          `)
          .eq('id', id)
          .single();

        if (error || !conversation) {
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

        // Sort messages by timestamp
        if (conversation.messages) {
          conversation.messages.sort((a: any, b: any) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        }

        return res.status(200).json({
          success: true,
          data: conversation
        });
      } else {
        // Get all user's conversations
        const supabase = getSupabaseClient();

        const { data: conversations, error } = await supabase
          .from(TABLES.CONVERSATIONS)
          .select(`
            *,
            messages:${TABLES.MESSAGES}(*)
          `)
          .eq('userId', userId)
          .order('lastMessageAt', { ascending: false });

        if (error) {
          throw new Error(`Failed to fetch conversations: ${error.message}`);
        }

        // Get only the last message for each conversation
        const conversationsWithLastMessage = (conversations || []).map((conv: any) => ({
          ...conv,
          messages: conv.messages
            ?.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            ?.slice(0, 1) || []
        }));

        return res.status(200).json({
          success: true,
          data: conversationsWithLastMessage
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