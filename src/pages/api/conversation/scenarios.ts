import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { supabase, TABLES } from '@/lib/supabase';

interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  initialMessage: string;
  possibleResponses: {
    userInput: string;
    botReply: string;
  }[];
}

interface ConversationTemplateRow {
  id: string;
  title: string;
  description: string | null;
  initial_message: string;
  level: string;
}

function mapLevel(level: string): 'beginner' | 'intermediate' | 'advanced' {
  switch (level) {
    case 'A1':
    case 'A2':
      return 'beginner';
    case 'B1':
    case 'B2':
      return 'intermediate';
    case 'C1':
    case 'C2':
      return 'advanced';
    default:
      return 'beginner';
  }
}

function mapDifficultyToLevels(difficulty: string): string[] {
  switch (difficulty) {
    case 'beginner':
      return ['A1', 'A2'];
    case 'intermediate':
      return ['B1', 'B2'];
    case 'advanced':
      return ['C1', 'C2'];
    default:
      return [difficulty];
  }
}

function toScenario(template: ConversationTemplateRow): ConversationScenario {
  return {
    id: template.id,
    title: template.title,
    description: template.description || 'Conversation scenario',
    difficulty: mapLevel(template.level),
    initialMessage: template.initial_message,
    possibleResponses: []
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ConversationScenario[] | ConversationScenario>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    const { id, difficulty } = req.query;

    let query = supabase
      .from(TABLES.CONVERSATION_TEMPLATES)
      .select('id,title,description,initial_message,level')
      .order('created_at', { ascending: true });

    if (id && typeof id === 'string') {
      query = query.eq('id', id);
    }

    if (difficulty && typeof difficulty === 'string') {
      query = query.in('level', mapDifficultyToLevels(difficulty));
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch conversation scenarios: ${error.message}`);
    }

    const scenarios = ((data || []) as ConversationTemplateRow[]).map(toScenario);

    if (id && typeof id === 'string') {
      const scenario = scenarios[0];
      if (!scenario) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Conversation scenario not found'
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: scenario
      });
    }

    return res.status(200).json({
      success: true,
      data: scenarios
    });
  } catch (error) {
    console.error('Error fetching conversation scenarios:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
