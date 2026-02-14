import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';

interface LessonExerciseRow {
  id: string;
  type: string;
  question: string;
  options: string[] | null;
  correct_answer: string | null;
}

interface LessonSectionRow {
  type: string;
  exercises?: LessonExerciseRow[];
}

interface LessonRow {
  id: string;
  level: string;
  sections?: LessonSectionRow[];
}

type ExamSection = 'comprehension-ecrite' | 'comprehension-orale' | 'expression-ecrite' | 'expression-orale' | 'grammaire' | 'vocabulaire';

function mapSection(section: ExamSection): 'reading' | 'listening' | 'writing' | 'speaking' | 'grammar' | 'vocabulary' {
  switch (section) {
    case 'comprehension-ecrite':
      return 'reading';
    case 'comprehension-orale':
      return 'listening';
    case 'expression-ecrite':
      return 'writing';
    case 'expression-orale':
      return 'speaking';
    case 'grammaire':
      return 'grammar';
    case 'vocabulaire':
      return 'vocabulary';
    default:
      return 'reading';
  }
}

function isQuestionInSection(questionType: string, mappedSection: ReturnType<typeof mapSection>): boolean {
  const type = questionType.toLowerCase();

  if (mappedSection === 'listening') return type.includes('audio') || type.includes('listening');
  if (mappedSection === 'speaking') return type.includes('speaking');
  if (mappedSection === 'writing') return type.includes('writing');
  if (mappedSection === 'grammar') return type.includes('grammar') || type.includes('fill') || type.includes('multiple');
  if (mappedSection === 'vocabulary') return type.includes('vocab') || type.includes('matching');
  return true;
}

function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

function parseCorrectAnswer(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = supabaseAdmin ?? supabase;

  if (!(await isAuthenticated(req))) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { section, level, id } = req.query;

    if (!section) {
      return res.status(200).json({
        sections: ['comprehension-ecrite', 'comprehension-orale', 'expression-ecrite', 'expression-orale', 'grammaire', 'vocabulaire'],
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
      });
    }

    const mappedSection = mapSection(section as ExamSection);

    try {
      let query = db
        .from(TABLES.LESSONS)
        .select(`
          id,
          level,
          sections:${TABLES.LESSON_SECTIONS}(
            type,
            exercises:${TABLES.LESSON_EXERCISES}(
              id,
              type,
              question,
              options,
              correct_answer
            )
          )
        `)
        .order('created_at', { ascending: true });

      if (level && typeof level === 'string') {
        query = query.eq('level', level);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch exam practice questions: ${error.message}`);
      }

      const questions = ((data || []) as LessonRow[]).flatMap((lesson) =>
        (lesson.sections || []).flatMap((lessonSection) =>
          (lessonSection.exercises || [])
            .filter((exercise) => isQuestionInSection(exercise.type, mappedSection))
            .map((exercise) => ({
              id: exercise.id,
              type: exercise.type,
              question: exercise.question,
              options: exercise.options || [],
              correctAnswer: parseCorrectAnswer(exercise.correct_answer)
            }))
        )
      );

      if (id && typeof id === 'string') {
        const question = questions.find((item) => item.id === id);
        if (!question) {
          return res.status(404).json({ message: 'Question not found' });
        }
        return res.status(200).json(question);
      }

      return res.status(200).json(questions);
    } catch (error) {
      console.error('Error fetching exam practice questions:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const userId = await getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { section, level, answers } = req.body as {
        section?: ExamSection;
        level?: string;
        answers?: Array<{ questionId: string; answer: string }>;
      };

      if (!section || !level || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Section, level, and answers are required' });
      }

      const mappedSection = mapSection(section);

      const { data, error } = await db
        .from(TABLES.LESSONS)
        .select(`
          id,
          level,
          sections:${TABLES.LESSON_SECTIONS}(
            type,
            exercises:${TABLES.LESSON_EXERCISES}(
              id,
              type,
              question,
              options,
              correct_answer
            )
          )
        `)
        .eq('level', level);

      if (error) {
        throw new Error(`Failed to load questions for submission: ${error.message}`);
      }

      const questionMap = new Map<string, string>();
      ((data || []) as LessonRow[]).forEach((lesson) => {
        (lesson.sections || []).forEach((lessonSection) => {
          (lessonSection.exercises || []).forEach((exercise) => {
            if (isQuestionInSection(exercise.type, mappedSection)) {
              const correct = parseCorrectAnswer(exercise.correct_answer);
              if (correct) {
                questionMap.set(exercise.id, correct);
              }
            }
          });
        });
      });

      let totalEvaluated = 0;
      let totalCorrect = 0;

      answers.forEach((entry) => {
        const correct = questionMap.get(entry.questionId);
        if (!correct) return;
        totalEvaluated += 1;
        if (normalizeText(entry.answer) === normalizeText(correct)) {
          totalCorrect += 1;
        }
      });

      const score = totalEvaluated > 0 ? Math.round((totalCorrect / totalEvaluated) * 100) : 0;

      const strengths = score >= 75
        ? ['Bonne compréhension générale', 'Réponses globalement précises']
        : ['Participation complète'];
      const weaknesses = score < 75
        ? ['Révisez les notions de cette section', 'Travaillez la précision des réponses']
        : [];

      await db.from(TABLES.EXAM_RESULTS).insert({
        user_id: userId,
        exam_type: 'practice',
        module: mappedSection,
        score: totalCorrect,
        max_score: totalEvaluated,
        percentage: score,
        level,
        completed_at: new Date().toISOString()
      });

      return res.status(200).json({
        score,
        feedback: {
          strengths,
          weaknesses
        },
        progress: {
          completed: 1,
          score
        }
      });
    } catch (error) {
      console.error('Exam submission error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
