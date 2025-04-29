import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, Lesson, LessonSection, LessonExercise } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';
import { prisma } from '@/lib/prisma';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Lesson>>
) {
  // GET request to retrieve a specific lesson
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid lesson ID'
          }
        });
      }

      const lessonId = parseInt(id, 10);

      if (isNaN(lessonId)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid lesson ID format'
          }
        });
      }

      // Find the lesson by ID with its sections
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: {
              exercises: true
            }
          }
        }
      });

      if (!lesson) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Lesson not found'
          }
        });
      }

      // Get user progress if authenticated
      let progress = null;
      const userId = (req as any).user?.id;

      if (userId) {
        progress = await prisma.lessonProgress.findUnique({
          where: {
            userId_lessonId: {
              userId,
              lessonId
            }
          }
        });
      }

      // Format the response
      const formattedLesson: Lesson = {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        duration: lesson.duration,
        topics: lesson.topics,
        sections: lesson.sections.map(section => ({
          id: section.id,
          lessonId: section.lessonId,
          title: section.title,
          type: section.type as any,
          content: section.content,
          audioUrl: section.audioUrl,
          videoUrl: section.videoUrl,
          order: section.order,
          exercises: section.exercises.map(exercise => ({
            id: exercise.id,
            sectionId: exercise.sectionId,
            type: exercise.type as any,
            question: exercise.question,
            options: exercise.options,
            correctAnswer: exercise.correctAnswer,
            explanation: exercise.explanation
          }))
        }))
      };

      return res.status(200).json({
        success: true,
        data: formattedLesson
      });
    } catch (error) {
      console.error('Error fetching lesson:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: {
      message: 'Method not allowed'
    }
  });
}

export default authMiddleware(handler);
