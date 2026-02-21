import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, LessonExercise } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';
import { supabase, TABLES } from '@/lib/supabase';

interface LessonExerciseRow {
  id: string;
  section_id: string;
  type: string;
  question: string;
  options: string[] | null;
  correct_answer: string | string[];
  explanation: string | null;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LessonExercise[]>>
) {
  // Only allow GET for this endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid section ID'
        }
      });
    }

    const sectionId = id;

    // Check if the section exists

    const { data: section, error: sectionError } = await supabase
      .from(TABLES.LESSON_SECTIONS)
      .select('*')
      .eq('id', sectionId)
      .single();

    if (sectionError || !section) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Section not found'
        }
      });
    }

    const { data: exercises, error: exercisesError } = await supabase
      .from(TABLES.LESSON_EXERCISES)
      .select('id,section_id,type,question,options,correct_answer,explanation')
      .eq('section_id', sectionId)
      .order('created_at', { ascending: true });

    if (exercisesError) {
      throw new Error(`Failed to fetch section exercises: ${exercisesError.message}`);
    }

    // Format the exercises for the response
    const formattedExercises: LessonExercise[] = ((exercises || []) as LessonExerciseRow[]).map((exercise) => ({
      id: exercise.id,
      sectionId: exercise.section_id,
      type: exercise.type as 'multiple-choice' | 'fill-in-blank' | 'matching' | 'writing' | 'speaking' | 'translation' | 'true-false',
      question: exercise.question,
      options: exercise.options || undefined,
      correctAnswer: exercise.correct_answer,
      explanation: exercise.explanation || undefined // Convert null to undefined
    }));

    return res.status(200).json({
      success: true,
      data: formattedExercises,
      exercises: formattedExercises
    });
  } catch (error) {
    console.error('Error fetching section exercises:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch section exercises'
      }
    });
  }
}

export default authMiddleware(handler);
