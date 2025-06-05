import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/utils/authMiddleware';
import { getUserId } from '@/utils/auth';
import { getSupabaseClient, TABLES } from '@/lib/supabase';

interface ResourceItem {
  id: string;
  title: string;
  type: 'lesson' | 'exercise' | 'video' | 'article';
  description: string;
  level: string;
  duration?: number;
  url?: string;
  thumbnail?: string;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }

  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    // Get user's current level and progress
    const supabase = getSupabaseClient();
    const { data: user, error: userError } = await supabase
      .from(TABLES.USERS)
      .select('level')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Get user's completed lessons
    const { data: completedLessons, error: progressError } = await supabase
      .from(TABLES.LESSON_PROGRESS)
      .select('lessonId')
      .eq('userId', userId)
      .eq('completed', true);

    if (progressError) {
      console.error('Error fetching completed lessons:', progressError);
    }

    const completedLessonIds = new Set((completedLessons || []).map(p => p.lessonId));

    // Get recommended lessons based on user's level
    const { data: lessons, error: lessonsError } = await supabase
      .from(TABLES.LESSONS)
      .select('*')
      .eq('level', user.level)
      .not('id', 'in', Array.from(completedLessonIds))
      .limit(3);

    if (lessonsError) {
      console.error('Error fetching recommended lessons:', lessonsError);
    }

    // Get recommended grammar rules
    const { data: grammarRules, error: grammarError } = await supabase
      .from(TABLES.GRAMMAR_RULES)
      .select('*')
      .eq('level', user.level)
      .limit(2);

    if (grammarError) {
      console.error('Error fetching grammar rules:', grammarError);
    }

    // Combine and format resources
    const resources: ResourceItem[] = [
      ...(lessons || []).map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        type: 'lesson' as const,
        description: lesson.description,
        level: lesson.level,
        duration: lesson.duration,
        thumbnail: lesson.thumbnail
      })),
      ...(grammarRules || []).map(rule => ({
        id: rule.id,
        title: rule.title,
        type: 'exercise' as const,
        description: rule.description,
        level: rule.level
      }))
    ];

    // Add some default resources if we don't have enough
    if (resources.length < 5) {
      const defaultResources: ResourceItem[] = [
        {
          id: 'default-1',
          title: 'French Pronunciation Guide',
          type: 'video',
          description: 'Learn the basics of French pronunciation with this comprehensive guide.',
          level: user.level,
          url: 'https://www.youtube.com/watch?v=example1',
          thumbnail: '/images/pronunciation-guide.jpg'
        },
        {
          id: 'default-2',
          title: 'Common French Phrases',
          type: 'article',
          description: 'Essential phrases for everyday conversation in French.',
          level: user.level,
          url: '/articles/common-phrases'
        }
      ];

      resources.push(...defaultResources.slice(0, 5 - resources.length));
    }

    return res.status(200).json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Error fetching recommended resources:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch recommended resources' }
    });
  }
}

export default authMiddleware(handler); 