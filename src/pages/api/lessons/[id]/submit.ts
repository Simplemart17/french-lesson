import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, LessonSubmissionResult } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';
import { prisma } from '@/lib/prisma';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LessonSubmissionResult>>
) {
  // Only allow POST for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { id } = req.query;
    const { answers } = req.body;
    
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
    
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid answers format'
        }
      });
    }
    
    // Get the user ID from the authenticated user
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated'
        }
      });
    }
    
    // Check if the lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        sections: {
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
    
    // Collect all exercises from all sections
    const exercises = lesson.sections.flatMap(section => section.exercises);
    
    // Calculate the score and generate feedback
    let correctCount = 0;
    const feedback: Record<number, { correct: boolean; explanation?: string }> = {};
    
    // Process each answer
    for (const [exerciseIdStr, userAnswer] of Object.entries(answers)) {
      const exerciseId = parseInt(exerciseIdStr, 10);
      const exercise = exercises.find(ex => ex.id === exerciseId);
      
      if (!exercise) {
        feedback[exerciseId] = {
          correct: false,
          explanation: 'Exercise not found'
        };
        continue;
      }
      
      // Check if the answer is correct
      let isCorrect = false;
      
      if (Array.isArray(exercise.correctAnswer)) {
        // For multiple correct answers (e.g., matching exercises)
        if (Array.isArray(userAnswer)) {
          isCorrect = exercise.correctAnswer.length === userAnswer.length &&
            exercise.correctAnswer.every(answer => userAnswer.includes(answer));
        }
      } else {
        // For single correct answer
        isCorrect = exercise.correctAnswer === userAnswer;
      }
      
      if (isCorrect) {
        correctCount++;
      }
      
      feedback[exerciseId] = {
        correct: isCorrect,
        explanation: exercise.explanation
      };
    }
    
    // Calculate the score as a percentage
    const totalExercises = Object.keys(answers).length;
    const score = totalExercises > 0 ? Math.round((correctCount / totalExercises) * 100) : 0;
    
    // Determine if the lesson is completed (typically 70% or higher is passing)
    const completed = score >= 70;
    
    // Update the user's progress
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      update: {
        score: score,
        completed: completed,
        completedAt: completed ? new Date() : null,
        answers: answers
      },
      create: {
        userId,
        lessonId,
        score: score,
        completed: completed,
        startedAt: new Date(),
        completedAt: completed ? new Date() : null,
        answers: answers
      }
    });
    
    return res.status(200).json({
      success: true,
      data: {
        score,
        feedback,
        completed
      }
    });
  } catch (error) {
    console.error('Error submitting lesson answers:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to submit lesson answers'
      }
    });
  }
}

export default authMiddleware(handler);
