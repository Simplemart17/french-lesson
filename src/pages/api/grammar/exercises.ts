import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { supabase, TABLES } from '@/lib/supabase';
import { authMiddleware } from '@/utils/authMiddleware';

interface GrammarExercise {
  id: number;
  sourceId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'multiple-choice' | 'fill-in-blank' | 'reorder';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
}

interface GrammarRuleRow {
  id: string;
  title: string;
  description: string;
  examples: string[] | null;
  level: string;
  category: string | null;
  created_at: string;
}

interface GrammarExerciseListResponse {
  items: GrammarExercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function mapDifficulty(level: string): 'beginner' | 'intermediate' | 'advanced' {
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

function toExercise(rule: GrammarRuleRow, idx: number): GrammarExercise {
  const examples = Array.isArray(rule.examples) ? rule.examples.filter(Boolean) : [];
  const options = examples.length >= 2 ? examples.slice(0, 4) : undefined;

  return {
    id: idx + 1,
    sourceId: rule.id,
    title: rule.title,
    description: rule.description,
    difficulty: mapDifficulty(rule.level),
    type: options && options.length >= 2 ? 'multiple-choice' : 'fill-in-blank',
    question: examples[0] || rule.description,
    options,
    correctAnswer: options && options.length > 0 ? options[0] : (examples[0] || rule.title)
  };
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GrammarExerciseListResponse>>
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
    const { difficulty, type, category, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const safePage = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
    const safeLimit = Number.isFinite(limitNum) && limitNum > 0 ? limitNum : 10;

    let query = supabase
      .from(TABLES.GRAMMAR_RULES)
      .select('id,title,description,examples,level,category,created_at')
      .order('created_at', { ascending: true });

    if (difficulty && typeof difficulty === 'string') {
      const levels = mapDifficultyToLevels(difficulty);
      query = query.in('level', levels);
    }

    if (category && typeof category === 'string') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    let exercises = ((data || []) as GrammarRuleRow[]).map(toExercise);

    if (type && typeof type === 'string') {
      exercises = exercises.filter((exercise) => exercise.type === type);
    }

    const startIndex = (safePage - 1) * safeLimit;
    const endIndex = startIndex + safeLimit;
    const items = exercises.slice(startIndex, endIndex);

    const payload = {
      items,
      total: exercises.length,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(exercises.length / safeLimit)
    };

    return res.status(200).json({
      success: true,
      data: payload,
      exercises: payload
    });
  } catch (error) {
    console.error('Error in grammar exercises API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}

export default authMiddleware(handler);
