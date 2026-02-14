import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { getUserId } from '@/utils/auth';
import { supabase, TABLES } from '../../../lib/supabase';
import { getOrCreateUserProfile } from '@/utils/userProfile';

interface SkillProgress {
  name: string;
  level: number; // 0-100
  category: 'speaking' | 'listening' | 'reading' | 'writing' | 'vocabulary' | 'grammar';
}

interface ActivityLog {
  id: string;
  date: string;
  activity: string;
  duration: number; // in minutes
  xpEarned: number;
  category?: 'speaking' | 'listening' | 'reading' | 'writing' | 'vocabulary' | 'grammar';
}

interface DailyProgress {
  date: string;
  xp: number;
  minutes: number;
}

interface ProgressData {
  skillProgress: SkillProgress[];
  activityLog: ActivityLog[];
  dailyProgress: DailyProgress[];
  totalXP: number;
  totalStudyTime: number;
  currentStreak: number;
  userLevel: number;
  xpProgress: number;
  xpForNextLevel: number;
}

interface LessonProgress {
  id: string;
  completed: boolean;
  score: number;
  completedAt: string | null;
  lesson?: {
    title?: string;
    duration?: number;
    topics?: string[];
  };
}

interface VocabularyProgress {
  id: string;
  lastPracticed: string | null;
  vocabulary?: {
    word: string;
    translation: string;
    pronunciation?: string;
    category?: string;
    level?: string;
  };
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    const { data: user, error: userError } = await getOrCreateUserProfile(userId);
    if (userError || !user) {
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch user profile' }
      });
    }

    // Get lesson progress for activity log
    const { data: lessonProgress, error: lessonError } = await supabase
      .from(TABLES.LESSON_PROGRESS)
      .select(`
        *,
        lesson:lesson_id (
          title,
          duration,
          topics
        )
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(20);

    if (lessonError) {
      console.error('Error fetching lesson progress:', lessonError);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch lesson progress' }
      });
    }

    // Get vocabulary progress
    const { data: vocabularyProgress, error: vocabError } = await supabase
      .from(TABLES.USER_VOCABULARY)
      .select(`
        *,
        vocabulary:vocabulary_id (
          french,
          english,
          pronunciation,
          category,
          level
        )
      `)
      .eq('user_id', userId)
      .eq('learned', true)
      .order('last_practiced', { ascending: false })
      .limit(10);

    if (vocabError) {
      console.error('Error fetching vocabulary progress:', vocabError);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch vocabulary progress' }
      });
    }

    // Calculate skill progress based on actual data
    const skillProgress: SkillProgress[] = [
      {
        name: 'Pronunciation',
        level: Math.min(100, Math.max(0, (lessonProgress || []).filter((p: LessonProgress) => p.lesson?.topics?.includes('pronunciation')).length * 10 + 30)),
        category: 'speaking'
      },
      {
        name: 'Conversation',
        level: Math.min(100, Math.max(0, (lessonProgress || []).filter((p: LessonProgress) => p.lesson?.topics?.includes('conversation')).length * 8 + 25)),
        category: 'speaking'
      },
      {
        name: 'Comprehension',
        level: Math.min(100, Math.max(0, (lessonProgress || []).filter((p: LessonProgress) => p.completed).length * 5 + 40)),
        category: 'listening'
      },
      {
        name: 'Reading',
        level: Math.min(100, Math.max(0, (lessonProgress || []).filter((p: LessonProgress) => p.lesson?.topics?.includes('reading')).length * 12 + 35)),
        category: 'reading'
      },
      {
        name: 'Writing',
        level: Math.min(100, Math.max(0, (lessonProgress || []).filter((p: LessonProgress) => p.lesson?.topics?.includes('writing')).length * 15 + 20)),
        category: 'writing'
      },
      {
        name: 'Vocabulary',
        level: Math.min(100, Math.max(0, (vocabularyProgress || []).length * 2 + 30)),
        category: 'vocabulary'
      },
      {
        name: 'Grammar',
        level: Math.min(100, Math.max(0, (lessonProgress || []).filter((p: LessonProgress) => p.lesson?.topics?.includes('grammar')).length * 8 + 35)),
        category: 'grammar'
      }
    ];

    // Build activity log from real data
    const activityLog: ActivityLog[] = [
      ...(lessonProgress || []).map((progress: LessonProgress) => ({
        id: progress.id,
        date: progress.completedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        activity: `Completed Lesson: ${progress.lesson?.title || 'Unknown Lesson'}`,
        duration: progress.lesson?.duration || 15,
        xpEarned: progress.score || 100,
        category: determineCategory(progress.lesson?.topics || [])
      })),
      ...(vocabularyProgress || []).slice(0, 5).map((vocab: VocabularyProgress) => ({
        id: `vocab-${vocab.id}`,
        date: vocab.lastPracticed?.split('T')[0] || new Date().toISOString().split('T')[0],
        activity: `Learned new word: ${vocab.vocabulary?.word || 'Unknown Word'}`,
        duration: 5,
        xpEarned: 25,
        category: 'vocabulary' as const
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 15);

    // Generate daily progress from activity log
    const dailyProgressMap = activityLog.reduce((acc: Record<string, DailyProgress>, activity) => {
      if (!acc[activity.date]) {
        acc[activity.date] = {
          date: activity.date,
          xp: 0,
          minutes: 0
        };
      }

      acc[activity.date].xp += activity.xpEarned;
      acc[activity.date].minutes += activity.duration;

      return acc;
    }, {});

    const dailyProgress = Object.values(dailyProgressMap).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate totals
    const totalXP = user?.points || 0;
    const totalStudyTime = activityLog.reduce((sum, activity) => sum + activity.duration, 0);
    const currentStreak = user?.streak_days || 0;

    // Calculate level based on XP
    const userLevel = Math.floor(totalXP / 500) + 1;
    const xpForNextLevel = userLevel * 500;
    const xpProgress = ((totalXP % 500) / 500) * 100;

    const progressData: ProgressData = {
      skillProgress,
      activityLog,
      dailyProgress,
      totalXP,
      totalStudyTime,
      currentStreak,
      userLevel,
      xpProgress,
      xpForNextLevel
    };

    return res.status(200).json({
      success: true,
      data: progressData
    });

  } catch (error) {
    console.error('Error fetching progress data:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch progress data' }
    });
  }
}

function determineCategory(topics: string[]): 'speaking' | 'listening' | 'reading' | 'writing' | 'vocabulary' | 'grammar' {
  if (topics.includes('grammar')) return 'grammar';
  if (topics.includes('vocabulary')) return 'vocabulary';
  if (topics.includes('speaking') || topics.includes('pronunciation')) return 'speaking';
  if (topics.includes('listening')) return 'listening';
  if (topics.includes('reading')) return 'reading';
  if (topics.includes('writing')) return 'writing';
  return 'vocabulary'; // default
}

export default authMiddleware(handler);
