import type { NextApiResponse } from 'next';
import { getOpenAIClient } from '../../../utils/openaiClient';
import { authMiddleware } from '../../../utils/authMiddleware';
import { AuthenticatedRequest, ChatMessage } from '@/types/api';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { message, conversationId, level = 'beginner' } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Message is required' } 
      });
    }
    
    // Get user ID from authenticated user
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    // Level-specific instructions
    let levelInstructions = '';
    switch (level) {
      case 'beginner':
        levelInstructions = 'Use simple, everyday vocabulary and basic grammar structures. Avoid complex tenses. Keep sentences short and clear.';
        break;
      case 'intermediate':
        levelInstructions = 'Use a mix of common and more advanced vocabulary. Include some idiomatic expressions. Use present, past, and future tenses.';
        break;
      case 'advanced':
        levelInstructions = 'Use sophisticated vocabulary and complex grammatical structures. Include colloquialisms, slang, and cultural references where appropriate.';
        break;
      default:
        levelInstructions = 'Use simple, everyday vocabulary and basic grammar structures.';
    }

    // For development, use mock conversation handling
    let conversation;
    let messageHistory: ChatMessage[] = [];

    if (conversationId) {
      // Mock existing conversation
      conversation = {
        id: conversationId,
        userId,
        title: 'French Tutoring Session',
        context: 'French language tutoring',
        startedAt: new Date(),
        lastMessageAt: new Date()
      };

      // Mock message history (empty for simplicity)
      messageHistory = [];
    } else {
      // Create a mock new conversation
      conversation = {
        id: 'conv_' + Date.now(),
        userId,
        title: message.slice(0, 30) + '...',
        context: 'French language tutoring',
        startedAt: new Date(),
        lastMessageAt: new Date()
      };
    }

    // Get OpenAI client
    const openai = getOpenAIClient();

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are a friendly and helpful French language tutor. Your goal is to help the user learn French.
          
          ${levelInstructions}
          
          For grammar or vocabulary mistakes in the user's French, provide gentle corrections.
          If the user writes in English, respond in both French and English.
          If the user writes in French, respond primarily in French with occasional English explanations for new vocabulary or grammar concepts.
          
          Format corrections like this:
          "Your sentence with [correction] and *explanation if needed*"
          
          For example: "Je suis [allé] au magasin hier. *Remember to use the past participle with être verbs.*"
          
          Keep your responses focused and educational. Your goal is to help the user improve their French in a supportive environment.`
        },
        ...messageHistory,
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Get the AI's response
    const aiResponse = response.choices[0].message.content || '';

    // Extract any corrections if present (for future enhancement, currently simplified)
    const corrections = [];
    const correctionRegex = /\[([^\]]+)\]/g;
    let match;
    while ((match = correctionRegex.exec(aiResponse)) !== null) {
      corrections.push({
        correction: match[1],
        context: match.input.substring(Math.max(0, match.index - 20), match.index + match[0].length + 20),
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        response: aiResponse,
        conversationId: conversation.id,
        corrections: corrections.length > 0 ? corrections : undefined
      }
    });
  } catch (error) {
    console.error('Tutor chat error:', error);
    return res.status(500).json({ 
      success: false, 
      error: { message: 'Failed to generate tutor response' } 
    });
  }
}

export default authMiddleware(handler); 
