import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { EXAM_TOPICS, difficultyForLevel } from '@/lib/curriculum';
import { toStoredSeconds } from '@/utils/apiUtils';

interface LessonExerciseRow {
  id: string;
  type: string;
  question: string;
  options: string[] | null;
  correct_answer: string | null;
  explanation: string | null;
}

interface LessonSectionRow {
  id: string;
  type: string;
  exercises?: LessonExerciseRow[];
}

interface LessonRow {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: number;
  topics: string[] | null;
  sections?: LessonSectionRow[];
}

interface ExamQuestion {
  id: string;
  type: 'multiple-choice' | 'audio-response' | 'writing' | 'speaking' | 'text-input';
  text: string;
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
}

interface ExamModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  section: 'listening' | 'reading' | 'writing' | 'speaking';
  difficulty: 'easy' | 'medium' | 'hard';
  examType: 'tcf' | 'tef';
  level: string;
  questions?: ExamQuestion[];
}

function inferSection(sections: LessonSectionRow[] = []): 'listening' | 'reading' | 'writing' | 'speaking' {
  const types = sections.map((section) => section.type.toLowerCase());

  if (types.some((type) => type.includes('audio') || type.includes('listening'))) return 'listening';
  if (types.some((type) => type.includes('speaking'))) return 'speaking';
  if (types.some((type) => type.includes('writing'))) return 'writing';
  return 'reading';
}

function inferExamType(topics: string[] | null): 'tcf' | 'tef' {
  const joined = (topics || []).join(' ').toLowerCase();
  if (joined.includes('tef')) return 'tef';
  return 'tcf';
}

function normalizeQuestionType(type: string): ExamQuestion['type'] {
  const normalized = type.toLowerCase();
  if (normalized.includes('multiple')) return 'multiple-choice';
  if (normalized.includes('audio')) return 'audio-response';
  if (normalized.includes('writing')) return 'writing';
  if (normalized.includes('speaking')) return 'speaking';
  return 'text-input';
}

function parseCorrectAnswer(value: string | null): string | string[] | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();

  if (!trimmed) return undefined;

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item));
      }
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

function mapLessonToModule(lesson: LessonRow, includeQuestions: boolean): ExamModule {
  const section = inferSection(lesson.sections || []);
  const questions: ExamQuestion[] = [];

  if (includeQuestions) {
    (lesson.sections || []).forEach((sectionRow) => {
      (sectionRow.exercises || []).forEach((exercise) => {
        const questionText = exercise.question || '';
        questions.push({
          id: exercise.id,
          type: normalizeQuestionType(exercise.type),
          text: questionText,
          question: questionText,
          options: exercise.options || undefined,
          correctAnswer: parseCorrectAnswer(exercise.correct_answer),
          explanation: exercise.explanation || undefined
        });
      });
    });
  }

  return {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration,
    section,
    difficulty: difficultyForLevel(lesson.level),
    examType: inferExamType(lesson.topics),
    level: lesson.level,
    questions: includeQuestions ? questions : undefined
  };
}

function normalizeAnswer(value: string | string[]): string {
  if (Array.isArray(value)) {
    return value.join(' ').toLowerCase().trim();
  }
  return value.toLowerCase().trim();
}

function isAnswerCorrect(userAnswer: string | string[], correctAnswer: string | string[] | undefined): boolean {
  if (!correctAnswer) return false;
  if (Array.isArray(correctAnswer)) {
    return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
  }
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  const db = supabaseAdmin ?? supabase;

  if (req.method === 'GET') {
    try {
      const { id, examType, section, difficulty } = req.query;

      let query = db
        .from(TABLES.LESSONS)
        .select(`
          id,
          title,
          description,
          level,
          duration,
          topics,
          sections:${TABLES.LESSON_SECTIONS}(
            id,
            type,
            exercises:${TABLES.LESSON_EXERCISES}(
              id,
              type,
              question,
              options,
              correct_answer,
              explanation
            )
          )
        `)
        // Only lessons explicitly tagged as exam content are exam modules;
        // without this, every seeded curriculum lesson would surface here.
        .overlaps('topics', EXAM_TOPICS)
        .order('created_at', { ascending: true });

      if (id && typeof id === 'string') {
        query = query.eq('id', id);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch exam modules: ${error.message}`);
      }

      // A lesson only counts as an exam module once it has real content;
      // seeded checkpoints have no exercises until AI generation runs, and
      // surfacing them empty would displace the client-side fallback modules.
      const lessons = ((data || []) as LessonRow[]).filter((lesson) =>
        (lesson.sections || []).some((section) => (section.exercises || []).length > 0)
      );
      const includeQuestions = !!id;
      let modules = lessons.map((lesson) => mapLessonToModule(lesson, includeQuestions));

      if (!id && examType && typeof examType === 'string') {
        modules = modules.filter((module) => module.examType === examType);
      }

      if (!id && section && typeof section === 'string') {
        modules = modules.filter((module) => module.section === section);
      }

      if (!id && difficulty && typeof difficulty === 'string') {
        modules = modules.filter((module) => module.difficulty === difficulty);
      }

      if (id) {
        const examModule = modules[0];
        if (!examModule) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Exam module not found'
            }
          });
        }

        return res.status(200).json({
          success: true,
          data: examModule,
          module: examModule
        });
      }

      const moduleSummaries = modules.map((module) => ({
        id: module.id,
        title: module.title,
        description: module.description,
        duration: module.duration,
        section: module.section,
        difficulty: module.difficulty,
        examType: module.examType,
        level: module.level
      }));

      return res.status(200).json({
        success: true,
        data: moduleSummaries,
        modules: moduleSummaries
      });
    } catch (error) {
      console.error('Error fetching exam modules:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  if (req.method === 'POST') {
    if (!(await isAuthenticated(req))) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized'
        }
      });
    }

    try {
      const userId = await getUserId(req);
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Unauthorized'
          }
        });
      }

      const { moduleId, answers, examType = 'practice', timeSpent } = req.body as {
        moduleId?: string;
        examType?: string;
        answers?: Array<{ questionId: string; answer: string | string[] }>;
        timeSpent?: number;
      };

      if (!moduleId || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Missing required fields or invalid format'
          }
        });
      }

      const { data: lesson, error } = await db
        .from(TABLES.LESSONS)
        .select(`
          id,
          title,
          description,
          level,
          duration,
          topics,
          sections:${TABLES.LESSON_SECTIONS}(
            id,
            type,
            exercises:${TABLES.LESSON_EXERCISES}(
              id,
              type,
              question,
              options,
              correct_answer,
              explanation
            )
          )
        `)
        .eq('id', moduleId)
        .single();

      if (error || !lesson) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Exam module not found'
          }
        });
      }

      const examModule = mapLessonToModule(lesson as LessonRow, true);
      const questionMap = new Map<string, ExamQuestion>();
      (examModule.questions || []).forEach((question) => {
        questionMap.set(question.id, question);
      });

      const results = answers.map((entry) => {
        const question = questionMap.get(entry.questionId);

        if (!question) {
          return {
            questionId: entry.questionId,
            isCorrect: false,
            score: 0,
            feedback: 'Question not found'
          };
        }

        if (question.type === 'writing' || question.type === 'speaking') {
          return {
            questionId: entry.questionId,
            isEvaluated: false,
            score: null,
            feedback: 'Your response has been recorded and will be reviewed.'
          };
        }

        const correct = isAnswerCorrect(entry.answer, question.correctAnswer);
        return {
          questionId: entry.questionId,
          isCorrect: correct,
          score: correct ? 1 : 0,
          feedback: correct
            ? `Correct${question.explanation ? `. ${question.explanation}` : ''}`
            : `Incorrect${question.correctAnswer ? `. Correct answer: ${Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}` : ''}${question.explanation ? `. ${question.explanation}` : ''}`
        };
      });

      const graded = results.filter((result) => 'isCorrect' in result) as Array<{ isCorrect: boolean; score: number }>;
      const correctCount = graded.filter((item) => item.isCorrect).length;
      const totalCount = graded.length;
      const percentage = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

      const { error: saveError } = await db
        .from(TABLES.EXAM_RESULTS)
        .insert({
          user_id: userId,
          exam_type: examType,
          module: examModule.section,
          score: correctCount,
          max_score: totalCount,
          percentage,
          level: examModule.level,
          time_spent: toStoredSeconds(timeSpent),
          completed_at: new Date().toISOString()
        });

      if (saveError) {
        throw new Error(`Failed to save exam submission: ${saveError.message}`);
      }

      const payload = {
        moduleId,
        results,
        score: Math.round(percentage),
        totalCorrect: correctCount,
        totalGraded: totalCount,
        totalQuestions: examModule.questions?.length || 0,
        submittedAt: new Date().toISOString()
      };

      return res.status(200).json({
        success: true,
        data: payload,
        submission: payload
      });
    } catch (error) {
      console.error('Error submitting exam answers:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: {
      message: 'Method not allowed'
    }
  });
}
