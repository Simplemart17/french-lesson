import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, LessonSection } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<LessonSection[]>>
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
          message: 'Invalid lesson ID'
        }
      });
    }
    
    const lessonId = id;
    
    // Mock lesson sections data
    const mockSections: LessonSection[] = [
      {
        id: `section-${lessonId}-1`,
        lessonId,
        title: 'Introduction',
        type: 'text',
        content: 'Welcome to this French lesson! In this section, we will learn basic French greetings and expressions.',
        order: 1
      },
      {
        id: `section-${lessonId}-2`,
        lessonId,
        title: 'Vocabulary',
        type: 'text',
        content: 'Key vocabulary words for this lesson: bonjour (hello), au revoir (goodbye), merci (thank you), s\'il vous plaît (please).',
        order: 2
      },
      {
        id: `section-${lessonId}-3`,
        lessonId,
        title: 'Practice Exercise',
        type: 'exercise',
        content: 'Complete the following exercises to practice what you\'ve learned.',
        order: 3
      },
      {
        id: `section-${lessonId}-4`,
        lessonId,
        title: 'Audio Practice',
        type: 'audio',
        content: 'Listen to the pronunciation and repeat.',
        audioUrl: '/audio/lesson-pronunciation.mp3',
        order: 4
      }
    ];

    const formattedSections = mockSections;
    
    return res.status(200).json({
      success: true,
      data: formattedSections
    });
  } catch (error) {
    console.error('Error fetching lesson sections:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch lesson sections'
      }
    });
  }
}

export default authMiddleware(handler);
