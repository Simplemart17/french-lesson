import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { prisma } from '../../../lib/prisma';
import { getUserId } from '@/utils/auth';

interface SkillProgress {
  name: string;
  level: number; // 0-100
  category: 'speaking' | 'listening' | 'reading' | 'writing' | 'vocabulary' | 'grammar';
}

interface ActivityLog {
  id: number;
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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        points: true,
        streakDays: true,
        level: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Get lesson progress for activity log
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            title: true,
            duration: true,
            topics: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 20
    });

    // Get vocabulary progress
    const vocabularyProgress = await prisma.userVocabulary.findMany({
      where: { 
        userId,
        learned: true
      },
      include: {
        vocabulary: {
          select: {
            word: true
          }
        }
      },
      orderBy: {
        lastPracticed: 'desc'
      },
      take: 10
    });

    // Calculate skill progress based on actual data
    const skillProgress: SkillProgress[] = [
      {
        name: 'Pronunciation',
        level: Math.min(100, Math.max(0, lessonProgress.filter(p => p.lesson.topics.includes('pronunciation')).length * 10 + 30)),
        category: 'speaking'
      },
      {
        name: 'Conversation',
        level: Math.min(100, Math.max(0, lessonProgress.filter(p => p.lesson.topics.includes('conversation')).length * 8 + 25)),
        category: 'speaking'
      },
      {
        name: 'Comprehension',
        level: Math.min(100, Math.max(0, lessonProgress.filter(p => p.completed).length * 5 + 40)),
        category: 'listening'
      },
      {
        name: 'Reading',
        level: Math.min(100, Math.max(0, lessonProgress.filter(p => p.lesson.topics.includes('reading')).length * 12 + 35)),
        category: 'reading'
      },
      {
        name: 'Writing',
        level: Math.min(100, Math.max(0, lessonProgress.filter(p => p.lesson.topics.includes('writing')).length * 15 + 20)),
        category: 'writing'
      },
      {
        name: 'Vocabulary',
        level: Math.min(100, Math.max(0, vocabularyProgress.length * 2 + 30)),
        category: 'vocabulary'
      },
      {
        name: 'Grammar',
        level: Math.min(100, Math.max(0, lessonProgress.filter(p => p.lesson.topics.includes('grammar')).length * 8 + 35)),
        category: 'grammar'
      }
    ];

    // Build activity log from real data
    const activityLog: ActivityLog[] = [
      ...lessonProgress.map((progress, index) => ({
        id: progress.id,
        date: progress.completedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        activity: `Completed Lesson: ${progress.lesson.title}`,
        duration: progress.lesson.duration || 15,
        xpEarned: progress.score || 100,
        category: determineCategory(progress.lesson.topics)
      })),
      ...vocabularyProgress.slice(0, 5).map((vocab, index) => ({
        id: vocab.id + 10000,
        date: vocab.lastPracticed?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        activity: `Learned new word: ${vocab.vocabulary.word}`,
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
    const totalXP = user.points;
    const totalStudyTime = activityLog.reduce((sum, activity) => sum + activity.duration, 0);
    const currentStreak = user.streakDays;

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
