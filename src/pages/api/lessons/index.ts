import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { getSupabaseClient, TABLES } from '@/lib/supabase';
import { ApiResponse, Lesson } from '@/types/api';

async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<Lesson[]>>) {
  // Only allow GET for this endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    // Extract query parameters
    const { level, topic } = req.query;

    // Development mode: Return mock data
    if (process.env.NODE_ENV === 'development') {
      const mockLessons = [
        {
          id: '1',
          title: 'Basic Greetings',
          description: 'Learn essential French greetings and introductions',
          level: 'A1',
          duration: 15,
          topics: ['greetings', 'introductions'],
          sectionCount: 3,
          imageUrl: '/images/lessons/1.jpg'
        },
        {
          id: '2',
          title: 'Numbers and Counting',
          description: 'Master French numbers from 1 to 100',
          level: 'A1',
          duration: 20,
          topics: ['numbers', 'counting'],
          sectionCount: 4,
          imageUrl: '/images/lessons/2.jpg'
        },
        {
          id: '3',
          title: 'Family and Relationships',
          description: 'Vocabulary for describing family members and relationships',
          level: 'A2',
          duration: 25,
          topics: ['family', 'relationships'],
          sectionCount: 5,
          imageUrl: '/images/lessons/3.jpg'
        },
        {
          id: '4',
          title: 'Past Tense Verbs',
          description: 'Learn to conjugate and use past tense in French',
          level: 'B1',
          duration: 30,
          topics: ['grammar', 'verbs', 'past-tense'],
          sectionCount: 6,
          imageUrl: '/images/lessons/4.jpg'
        }
      ];

      // Apply filters
      let filteredLessons = mockLessons;

      if (level && typeof level === 'string') {
        filteredLessons = filteredLessons.filter(lesson => lesson.level === level);
      }

      if (topic && typeof topic === 'string') {
        filteredLessons = filteredLessons.filter(lesson =>
          lesson.topics.some(t => t.toLowerCase() === topic.toLowerCase())
        );
      }

      return res.status(200).json({
        success: true,
        data: filteredLessons
      });
    }

    // Production mode: Use Supabase
    const supabase = getSupabaseClient();

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
    const processedLessons = filteredLessons.map((lesson: any) => {
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
