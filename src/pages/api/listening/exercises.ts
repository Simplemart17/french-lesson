import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { supabase, TABLES } from '@/lib/supabase';

interface DictationExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl: string;
  text: string;
  type: 'dictation';
}

interface ComprehensionExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl: string;
  transcript: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
  }[];
  type: 'comprehension';
}

type ListeningExercise = DictationExercise | ComprehensionExercise;

interface PronunciationRow {
  id: string;
  text: string;
  translation: string | null;
  level: string;
}

interface LessonExerciseRow {
  id: string;
  question: string;
  options: string[] | null;
  correct_answer: string | null;
}

interface LessonSectionRow {
  id: string;
  title: string;
  type: string;
  content: string | null;
  exercises?: LessonExerciseRow[];
}

interface LessonRow {
  id: string;
  title: string;
  description: string;
  level: string;
  sections?: LessonSectionRow[];
}

function mapDifficulty(level: string): 'beginner' | 'intermediate' | 'advanced' {
  if (level === 'A1' || level === 'A2') return 'beginner';
  if (level === 'B1' || level === 'B2') return 'intermediate';
  return 'advanced';
}

function buildDictationExercises(rows: PronunciationRow[]): DictationExercise[] {
  return rows.map((row) => ({
    id: `dict-${row.id}`,
    title: `Dictation: ${row.text.slice(0, 48)}${row.text.length > 48 ? '...' : ''}`,
    description: row.translation || 'Dictation practice from pronunciation content.',
    difficulty: mapDifficulty(row.level),
    audioUrl: `/api/tts?text=${encodeURIComponent(row.text)}&lang=fr`,
    text: row.text,
    type: 'dictation'
  }));
}

function buildComprehensionExercises(rows: LessonRow[]): ComprehensionExercise[] {
  const exercises: ComprehensionExercise[] = [];

  rows.forEach((lesson) => {
    (lesson.sections || []).forEach((section) => {
      const sectionType = section.type.toLowerCase();
      if (!sectionType.includes('listening') && !sectionType.includes('audio') && !sectionType.includes('exercise')) {
        return;
      }

      const questions = (section.exercises || [])
        .filter((exercise) => Array.isArray(exercise.options) && exercise.options.length > 0)
        .map((exercise) => ({
          id: exercise.id,
          text: exercise.question,
          options: exercise.options || [],
          correctAnswer: exercise.correct_answer || ''
        }));

      if (questions.length === 0) {
        return;
      }

      const transcript = section.content || lesson.description;
      exercises.push({
        id: `comp-${section.id}`,
        title: `${lesson.title} - ${section.title}`,
        description: lesson.description,
        difficulty: mapDifficulty(lesson.level),
        audioUrl: `/api/tts?text=${encodeURIComponent(transcript)}&lang=fr`,
        transcript,
        questions,
        type: 'comprehension'
      });
    });
  });

  return exercises;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ListeningExercise[] | ListeningExercise>>
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
    const { id, type, difficulty } = req.query;

    const [{ data: pronunciationData, error: pronunciationError }, { data: lessonData, error: lessonError }] = await Promise.all([
      supabase
        .from(TABLES.PRONUNCIATION_EXERCISES)
        .select('id,text,translation,level')
        .order('created_at', { ascending: true }),
      supabase
        .from(TABLES.LESSONS)
        .select(`
          id,
          title,
          description,
          level,
          sections:${TABLES.LESSON_SECTIONS}(
            id,
            title,
            type,
            content,
            exercises:${TABLES.LESSON_EXERCISES}(
              id,
              question,
              options,
              correct_answer
            )
          )
        `)
        .order('created_at', { ascending: true })
    ]);

    if (pronunciationError) {
      throw new Error(`Failed to fetch pronunciation exercises: ${pronunciationError.message}`);
    }

    if (lessonError) {
      throw new Error(`Failed to fetch lesson exercises: ${lessonError.message}`);
    }

    const dictationExercises = buildDictationExercises((pronunciationData || []) as PronunciationRow[]);
    const comprehensionExercises = buildComprehensionExercises((lessonData || []) as LessonRow[]);

    let allExercises: ListeningExercise[] = [...dictationExercises, ...comprehensionExercises];

    if (type === 'dictation') {
      allExercises = dictationExercises;
    } else if (type === 'comprehension') {
      allExercises = comprehensionExercises;
    }

    if (difficulty && typeof difficulty === 'string') {
      allExercises = allExercises.filter((exercise) => exercise.difficulty === difficulty);
    }

    if (id && typeof id === 'string') {
      const exercise = allExercises.find((item) => item.id === id);
      if (!exercise) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Exercise not found'
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: exercise
      });
    }

    return res.status(200).json({
      success: true,
      data: allExercises
    });
  } catch (error) {
    console.error('Error fetching listening exercises:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
