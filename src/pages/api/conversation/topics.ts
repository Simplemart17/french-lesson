import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { ConversationTopic } from '@/services/api/conversationApiService';
import { supabase, TABLES } from '@/lib/supabase';

interface ConversationTemplateRow {
  id: string;
  title: string;
  description: string | null;
  topics: string[] | null;
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

function mapLevelFilter(level: string): string[] {
  switch (level) {
    case 'beginner':
      return ['A1', 'A2'];
    case 'intermediate':
      return ['B1', 'B2'];
    case 'advanced':
      return ['C1', 'C2'];
    default:
      return [level];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ConversationTopic[]>>
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
    const { level } = req.query;

    let query = supabase
      .from(TABLES.CONVERSATION_TEMPLATES)
      .select('id,title,description,topics,level')
      .order('created_at', { ascending: true });

    if (level && typeof level === 'string') {
      query = query.in('level', mapLevelFilter(level));
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch conversation templates: ${error.message}`);
    }

    const topics: ConversationTopic[] = ((data || []) as ConversationTemplateRow[]).map((template) => ({
      id: template.id,
      title: template.title,
      description: template.description || 'Conversation practice topic',
      level: mapLevel(template.level),
      category: template.topics?.[0] || 'general'
    }));

    return res.status(200).json({
      success: true,
      data: topics
    });
  } catch (error) {
    console.error('Error in conversation topics API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
