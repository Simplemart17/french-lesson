import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { supabase, TABLES } from '@/lib/supabase';
import { ApiResponse, Lesson, DatabaseLesson } from '@/types/api';

async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<Lesson[]>>) {
  // Only allow GET for this endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    // Extract query parameters
    const { level, topic } = req.query;
    // Build query
    let query = supabase
      .from(TABLES.LESSONS)
      .select(`
        *,
        sections:${TABLES.LESSON_SECTIONS}(count)
      `)
      .order('id', { ascending: true });

    // Apply level filter if provided
    if (level && typeof level === 'string') {
      query = query.eq('level', level);
    }

    const { data: lessons, error } = await query;

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!lessons) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // If topic is provided, filter in memory (since array filtering is complex in Supabase)
    let filteredLessons = lessons;
    if (topic && typeof topic === 'string') {
      filteredLessons = lessons.filter(lesson =>
        lesson.topics && lesson.topics.some((t: string) => t.toLowerCase() === topic.toLowerCase())
      );
    }

    // Process lessons for client
    const processedLessons = filteredLessons.map((lesson: DatabaseLesson) => {
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        duration: lesson.duration,
        topics: lesson.topics,
        // Include section count to indicate lesson size
        sectionCount: lesson.sections ? lesson.sections.length : 0,
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
