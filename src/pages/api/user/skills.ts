import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient, TABLES } from '@/lib/supabase';
import { getUserId } from '@/utils/auth';
import { LessonProgress } from '@/types/api';
import { authMiddleware } from '@/utils/authMiddleware';

interface SkillResponse {
  skill: string;
  level: string;
  percentage: number;
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
    // Get user ID from the authenticated request
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    // Get Supabase client
    const supabase = getSupabaseClient();

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Get lesson progress to calculate skills based on real data
    const { data: lessonProgress, error: progressError } = await supabase
      .from(TABLES.LESSON_PROGRESS)
      .select(`
        *,
        lesson:lesson_id(topics, level)
      `)
      .eq('user_id', userId)
      .eq('completed', true);

    if (progressError) {
      console.error('Error fetching lesson progress:', progressError);
    }

    // Get vocabulary progress
    const { count: vocabularyCount, error: vocabError } = await supabase
      .from(TABLES.USER_VOCABULARY)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('learned', true);

    if (vocabError) {
      console.error('Error fetching vocabulary count:', vocabError);
    }

    // Calculate skill levels based on actual progress
    const completedLessons = (lessonProgress || []).length;
    const basePercentage = Math.min(80, completedLessons * 3);

    // Calculate specific skill percentages
    const listeningLessons = (lessonProgress || []).filter((p: LessonProgress & { lesson?: { topics?: string[] } }) =>
      p.lesson?.topics?.includes('listening') || p.lesson?.topics?.includes('comprehension')
    ).length;

    const speakingLessons = (lessonProgress || []).filter((p: LessonProgress & { lesson?: { topics?: string[] } }) =>
      p.lesson?.topics?.includes('speaking') || p.lesson?.topics?.includes('pronunciation') || p.lesson?.topics?.includes('conversation')
    ).length;

    const readingLessons = (lessonProgress || []).filter((p: LessonProgress & { lesson?: { topics?: string[] } }) =>
      p.lesson?.topics?.includes('reading')
    ).length;

    const writingLessons = (lessonProgress || []).filter((p: LessonProgress & { lesson?: { topics?: string[] } }) =>
      p.lesson?.topics?.includes('writing')
    ).length;

    const grammarLessons = (lessonProgress || []).filter((p: LessonProgress & { lesson?: { topics?: string[] } }) =>
      p.lesson?.topics?.includes('grammar')
    ).length;

    // Map user level to CEFR level
    const cefrLevel = mapUserLevelToCEFR(user.level);

    const skills: SkillResponse[] = [
      {
        skill: 'Listening',
        level: cefrLevel,
        percentage: Math.min(100, Math.max(20, basePercentage + listeningLessons * 5))
      },
      {
        skill: 'Speaking',
        level: cefrLevel,
        percentage: Math.min(100, Math.max(15, basePercentage + speakingLessons * 6))
      },
      {
        skill: 'Reading',
        level: cefrLevel,
        percentage: Math.min(100, Math.max(25, basePercentage + readingLessons * 7))
      },
      {
        skill: 'Writing',
        level: cefrLevel,
        percentage: Math.min(100, Math.max(10, basePercentage + writingLessons * 8))
      },
      {
        skill: 'Grammar',
        level: cefrLevel,
        percentage: Math.min(100, Math.max(20, basePercentage + grammarLessons * 6))
      },
      {
        skill: 'Vocabulary',
        level: cefrLevel,
        percentage: Math.min(100, Math.max(30, basePercentage + Math.floor((vocabularyCount || 0) / 5) * 3))
      }
    ];

    return res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    console.error('Error fetching user skills:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user skills' }
    });
  }
}

function mapUserLevelToCEFR(userLevel: string): string {
  switch (userLevel.toLowerCase()) {
    case 'beginner':
    case 'a1':
      return 'A1';
    case 'elementary':
    case 'a2':
      return 'A2';
    case 'intermediate':
    case 'b1':
      return 'B1';
    case 'upper-intermediate':
    case 'b2':
      return 'B2';
    case 'advanced':
    case 'c1':
      return 'C1';
    case 'proficient':
    case 'c2':
      return 'C2';
    default:
      return 'A1';
  }
}

export default authMiddleware(handler);