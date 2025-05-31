import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, LessonSection } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';
import { prisma } from '@/lib/prisma';

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
    
    // Check if the lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Lesson not found'
        }
      });
    }
    
    // Get sections for the lesson
    const sections = await prisma.lessonSection.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' }
    });
    
    // Format the sections for the response
    const formattedSections: LessonSection[] = sections.map(section => ({
      id: section.id,
      lessonId: section.lessonId,
      title: section.title,
      type: section.type as any,
      content: section.content || undefined,
      audioUrl: section.audioUrl || undefined,
      videoUrl: section.videoUrl || undefined,
      order: section.order
    }));
    
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
