import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { supabase, TABLES } from '@/lib/supabase';

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
  created_at: string;
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GrammarExercise>>
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
    const { id } = req.query;
    const requestedId = id as string;

    const { data, error } = await supabase
      .from(TABLES.GRAMMAR_RULES)
      .select('id,title,description,examples,level,created_at')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    const exercises = ((data || []) as GrammarRuleRow[]).map(toExercise);

    let exercise: GrammarExercise | undefined;
    const numericId = parseInt(requestedId, 10);

    if (Number.isFinite(numericId) && numericId > 0) {
      exercise = exercises.find((item) => item.id === numericId);
    } else {
      exercise = exercises.find((item) => item.sourceId === requestedId);
    }

    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Grammar exercise with ID ${requestedId} not found`
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Error in grammar exercise API:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
