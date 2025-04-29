import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { prisma } from '../../../lib/prisma';
import { ApiResponse, Lesson } from '@/types/api';

async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<Lesson[]>>) {
  // Only allow GET for this endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    // Extract query parameters
    const { level, topic } = req.query;

    // Build filter conditions
    const filters: any = {};

    if (level && typeof level === 'string') {
      filters.level = level;
    }

    // Get lessons from database with their sections count
    const lessons = await prisma.lesson.findMany({
      where: filters,
      orderBy: {
        id: 'asc',
      },
      include: {
        _count: {
          select: { sections: true }
        }
      }
    });

    // If topic is provided, filter in memory (since array filtering is harder in Prisma)
    let filteredLessons = lessons;
    if (topic && typeof topic === 'string') {
      filteredLessons = lessons.filter(lesson =>
        lesson.topics.some(t => t.toLowerCase() === topic.toLowerCase())
      );
    }

    // Process lessons for client
    const processedLessons = filteredLessons.map((lesson) => {
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        duration: lesson.duration,
        topics: lesson.topics,
        // Include section count to indicate lesson size
        sectionCount: lesson._count.sections,
        // Add a default image URL
        imageUrl: `/images/lessons/${lesson.id}.jpg`
      };
    });

    // Return filtered lessons
    return res.status(200).json({
      success: true,
      data: processedLessons
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch lessons' }
    });
  }
}

export default authMiddleware(handler);
