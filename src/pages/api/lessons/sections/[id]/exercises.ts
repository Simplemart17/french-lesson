import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, LessonExercise } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';
import { prisma } from '@/lib/prisma';

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

    const sectionId = parseInt(id, 10);

    if (isNaN(sectionId)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid section ID format'
        }
      });
    }

    // Check if the section exists
    const section = await prisma.lessonSection.findUnique({
      where: { id: sectionId }
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Section not found'
        }
      });
    }

    // Get exercises for the section
    const exercises = await prisma.lessonExercise.findMany({
      where: { sectionId }
    });

    // Format the exercises for the response
    const formattedExercises: LessonExercise[] = exercises.map(exercise => ({
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
