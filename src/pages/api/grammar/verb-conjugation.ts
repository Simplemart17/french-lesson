import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { supabase, TABLES } from '@/lib/supabase';
import { authMiddleware } from '@/utils/authMiddleware';

interface VerbConjugationExercise {
  id: string;
  verb: string;
  tense: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  group?: 1 | 2 | 3 | 'irregular';
  conjugations: {
    pronoun: string;
    correctAnswer: string;
  }[];
}

interface GrammarRuleRow {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string | null;
}

const PRONOUNS = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];

function mapDifficulty(level: string): 'beginner' | 'intermediate' | 'advanced' {
  if (level === 'A1' || level === 'A2') return 'beginner';
  if (level === 'B1' || level === 'B2') return 'intermediate';
  return 'advanced';
}

function inferGroup(verb: string): 1 | 2 | 3 | 'irregular' {
  if (['etre', 'avoir', 'aller', 'faire'].includes(verb)) return 'irregular';
  if (verb.endsWith('er')) return 1;
  if (verb.endsWith('ir')) return 2;
  return 3;
}

function normalizeVerb(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
}

function conjugatePresent(verb: string): string[] {
  const normalized = normalizeVerb(verb);

  const irregular: Record<string, string[]> = {
    etre: ['suis', 'es', 'est', 'sommes', 'etes', 'sont'],
    avoir: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
    aller: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
    faire: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font']
  };

  if (irregular[normalized]) {
    return irregular[normalized];
  }

  if (normalized.endsWith('er')) {
    const stem = normalized.slice(0, -2);
    return [
      `${stem}e`,
      `${stem}es`,
      `${stem}e`,
      `${stem}ons`,
      `${stem}ez`,
      `${stem}ent`
    ];
  }

  if (normalized.endsWith('ir')) {
    const stem = normalized.slice(0, -2);
    return [
      `${stem}is`,
      `${stem}is`,
      `${stem}it`,
      `${stem}issons`,
      `${stem}issez`,
      `${stem}issent`
    ];
  }

  return [verb, verb, verb, verb, verb, verb];
}

function extractVerb(title: string): string {
  const match = title.match(/\b([A-Za-zÀ-ÿ'-]+)\b/);
  return match?.[1] || 'parler';
}

function extractTense(title: string, description: string): string {
  const source = `${title} ${description}`.toLowerCase();
  if (source.includes('passe compose')) return 'passé composé';
  if (source.includes('futur')) return 'futur';
  if (source.includes('imparfait')) return 'imparfait';
  return 'présent';
}

function toExercise(rule: GrammarRuleRow): VerbConjugationExercise {
  const verb = extractVerb(rule.title);
  const tense = extractTense(rule.title, rule.description);
  const forms = conjugatePresent(verb);

  return {
    id: rule.id,
    verb,
    tense,
    description: rule.description,
    difficulty: mapDifficulty(rule.level),
    group: inferGroup(normalizeVerb(verb)),
    conjugations: PRONOUNS.map((pronoun, index) => ({
      pronoun,
      correctAnswer: forms[index] || forms[0]
    }))
  };
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  if (req.method === 'GET') {
    try {
      const { id, difficulty, verb, tense, group } = req.query;

      let query = supabase
        .from(TABLES.GRAMMAR_RULES)
        .select('id,title,description,level,category')
        .order('created_at', { ascending: true });

      if (difficulty && typeof difficulty === 'string') {
        const levels = difficulty === 'beginner'
          ? ['A1', 'A2']
          : difficulty === 'intermediate'
            ? ['B1', 'B2']
            : difficulty === 'advanced'
              ? ['C1', 'C2']
              : [difficulty];
        query = query.in('level', levels);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch verb conjugation exercises: ${error.message}`);
      }

      let exercises = ((data || []) as GrammarRuleRow[])
        .filter((rule) => !rule.category || rule.category.toLowerCase().includes('verb') || rule.title.toLowerCase().includes('verb'))
        .map(toExercise);

      if (id && typeof id === 'string') {
        const exercise = exercises.find((item) => item.id === id);
        if (!exercise) {
          return res.status(404).json({
            success: false,
            error: { message: 'Exercise not found' }
          });
        }
        return res.status(200).json({ success: true, data: exercise, exercise });
      }

      if (verb && typeof verb === 'string') {
        exercises = exercises.filter((item) => normalizeVerb(item.verb) === normalizeVerb(verb));
      }

      if (tense && typeof tense === 'string') {
        exercises = exercises.filter((item) => item.tense.toLowerCase() === tense.toLowerCase());
      }

      if (group) {
        exercises = exercises.filter((item) => String(item.group) === String(group));
      }

      return res.status(200).json({ success: true, data: exercises, exercises });
    } catch (error) {
      console.error('Error fetching verb conjugation exercises:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { exerciseId, answers } = req.body as {
        exerciseId?: string;
        answers?: Array<{ pronoun: string; answer: string }>;
      };

      if (!exerciseId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing required fields or invalid format' }
        });
      }

      const { data, error } = await supabase
        .from(TABLES.GRAMMAR_RULES)
        .select('id,title,description,level,category')
        .eq('id', exerciseId)
        .single();

      if (error || !data) {
        return res.status(404).json({
          success: false,
          error: { message: 'Exercise not found' }
        });
      }

      const exercise = toExercise(data as GrammarRuleRow);

      const results = answers.map((answer) => {
        const conjugation = exercise.conjugations.find((item) => item.pronoun === answer.pronoun);
        if (!conjugation) {
          return {
            pronoun: answer.pronoun,
            isCorrect: false,
            correctAnswer: 'Unknown',
            userAnswer: answer.answer
          };
        }

        const isCorrect = answer.answer.trim().toLowerCase() === conjugation.correctAnswer.toLowerCase();
        return {
          pronoun: answer.pronoun,
          isCorrect,
          correctAnswer: conjugation.correctAnswer,
          userAnswer: answer.answer
        };
      });

      const correctCount = results.filter((item) => item.isCorrect).length;
      const totalCount = results.length;
      const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

      const payload = {
        results,
        score,
        totalCorrect: correctCount,
        totalQuestions: totalCount
      };

      return res.status(200).json({
        success: true,
        data: payload,
        result: payload
      });
    } catch (error) {
      console.error('Error checking conjugation answers:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: { message: 'Method not allowed' }
  });
}

export default authMiddleware(handler);
