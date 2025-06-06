import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, LessonExercise, DatabaseLessonExercise } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';
import { supabase, TABLES } from '@/lib/supabase';

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

    // NOTE: LessonExercise table is not defined in TABLES constant
    // This suggests exercises might be stored differently in Supabase
    // For now, returning empty array - this needs to be updated based on actual schema
    const exercises: DatabaseLessonExercise[] = [];

    // Format the exercises for the response
    const formattedExercises: LessonExercise[] = exercises.map((exercise: DatabaseLessonExercise) => ({
      id: exercise.id,
      sectionId: exercise.sectionId,
      type: exercise.type as 'multiple-choice' | 'fill-in-blank' | 'matching' | 'writing' | 'speaking' | 'translation' | 'true-false',
      question: exercise.question,
      options: exercise.options,
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation || undefined // Convert null to undefined
    }));

    return res.status(200).json({
      success: true,
      data: formattedExercises
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
