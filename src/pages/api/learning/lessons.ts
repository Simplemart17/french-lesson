import { NextApiRequest, NextApiResponse } from 'next';
import { 
  getAllLessons, 
  getLessonsByLevel, 
  getLessonsByTopic, 
  getLessonById,
  updateLessonProgress,
  getLessonProgress
} from '@/utils/mockDb';
import { ApiResponse, Lesson, LessonProgress } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ 
      success: false, 
      error: {
        message: 'Unauthorized'
      }
    });
  }

  const userId = getUserId(req);

  if (req.method === 'GET') {
    const { level, topic, id } = req.query;
    
    // Get a specific lesson by ID
    if (id) {
      const lessonId = parseInt(id as string, 10);
      const lesson = getLessonById(lessonId);
      
      if (!lesson) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Lesson not found'
          }
        });
      }
      
      // Get user's progress for this lesson, if any
      const progress = getLessonProgress(userId, lessonId) as LessonProgress | undefined;
      
      return res.status(200).json({
        success: true,
        data: {
          ...lesson,
          progress: progress || null
        }
      });
    }
    
    // Filter lessons based on query parameters
    let lessons: Lesson[] = [];
    
    if (level && topic) {
      // First filter by level, then by topic
      lessons = getLessonsByLevel(level as string)
        .filter(lesson => lesson.topics.includes(topic as string));
    } else if (level) {
      lessons = getLessonsByLevel(level as string);
    } else if (topic) {
      lessons = getLessonsByTopic(topic as string);
    } else {
      lessons = getAllLessons();
    }
    
    // Return list of lessons (without full content)
    return res.status(200).json({
      success: true,
      data: lessons.map(({ content, ...lesson }) => lesson)
    });
  } else if (req.method === 'POST') {
    // For tracking lesson progress/completion
    try {
      const { lessonId, completed, score, startedAt, completedAt, answers } = req.body;
      
      if (!lessonId) {
        return res.status(400).json({ 
          success: false, 
          error: {
            message: 'Lesson ID is required'
          }
        });
      }
      
      // Update the user's progress in the database
      const progress = updateLessonProgress(userId, lessonId, {
        completed: completed || false,
        score: score || 0,
        startedAt,
        completedAt,
        answers
      });
      
      if (!progress) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Failed to update lesson progress'
          }
        });
      }
      
      return res.status(200).json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Lesson progress update error:', error);
      return res.status(500).json({ 
        success: false, 
        error: {
          message: 'Internal server error'
        }
      });
    }
  } else {
    return res.status(405).json({ 
      success: false, 
      error: {
        message: 'Method not allowed'
      }
    });
  }
} 