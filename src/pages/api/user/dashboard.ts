import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { prisma } from '../../../lib/prisma';
import { getUserId } from '@/utils/auth';

interface DashboardData {
  user: {
    name: string;
    level: string;
    points: number;
    streakDays: number;
    dailyGoal: number;
    completedLessons: number;
  };
  dailyProgress: {
    minutesStudied: number;
    goalMinutes: number;
    progressPercentage: number;
  };
  recentActivities: Array<{
    id: string;
    type: 'lesson' | 'vocabulary' | 'pronunciation' | 'conversation';
    title: string;
    description: string;
    timestamp: string;
    score?: number;
  }>;
  recommendations: Array<{
    id: string;
    type: 'lesson' | 'practice' | 'review';
    title: string;
    description: string;
    url: string;
  }>;
  stats: {
    totalLessons: number;
    completedLessons: number;
    vocabularyLearned: number;
    currentStreak: number;
    totalPoints: number;
  };
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
        name: true,
        level: true,
        points: true,
        streakDays: true,
        dailyGoal: true,
        completedLessons: true,
        lastActive: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Get lesson progress
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            title: true,
            duration: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 10
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
      take: 5
    });

    // Calculate daily progress (simplified - you might want to track actual study time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        completedAt: {
          gte: today
        }
      },
      include: {
        lesson: {
          select: {
            duration: true
          }
        }
      }
    });

    const minutesStudiedToday = todayProgress.reduce((total, progress) => {
      return total + (progress.lesson.duration || 0);
    }, 0);

    // Get total lesson count
    const totalLessons = await prisma.lesson.count();

    // Build recent activities
    const recentActivities = [
      ...lessonProgress.slice(0, 5).map(progress => ({
        id: `lesson-${progress.id}`,
        type: 'lesson' as const,
        title: `Completed Lesson: ${progress.lesson.title}`,
        description: `Score: ${progress.score}%`,
        timestamp: progress.completedAt?.toISOString() || new Date().toISOString(),
        score: progress.score
      })),
      ...vocabularyProgress.slice(0, 3).map(vocab => ({
        id: `vocab-${vocab.id}`,
        type: 'vocabulary' as const,
        title: `Learned new word: ${vocab.vocabulary.word}`,
        description: 'Added to vocabulary',
        timestamp: vocab.lastPracticed?.toISOString() || new Date().toISOString()
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

    // Generate recommendations based on user level and progress
    const recommendations = [];
    
    // Get next lesson recommendation
    const nextLesson = await prisma.lesson.findFirst({
      where: {
        level: user.level,
        NOT: {
          progress: {
            some: {
              userId,
              completed: true
            }
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });

    if (nextLesson) {
      recommendations.push({
        id: `lesson-${nextLesson.id}`,
        type: 'lesson' as const,
        title: 'Continue Learning',
        description: nextLesson.title,
        url: `/lessons/${nextLesson.id}`
      });
    }

    // Add vocabulary review recommendation
    const vocabularyToReview = await prisma.userVocabulary.count({
      where: {
        userId,
        nextReviewDate: {
          lte: new Date()
        }
      }
    });

    if (vocabularyToReview > 0) {
      recommendations.push({
        id: 'vocab-review',
        type: 'review' as const,
        title: 'Review Vocabulary',
        description: `${vocabularyToReview} words ready for review`,
        url: '/vocabulary?filter=review'
      });
    }

    // Add pronunciation practice recommendation
    recommendations.push({
      id: 'pronunciation-practice',
      type: 'practice' as const,
      title: 'Practice Speaking',
      description: 'Improve your French pronunciation',
      url: '/pronunciation'
    });

    const dashboardData: DashboardData = {
      user: {
        name: user.name,
        level: user.level,
        points: user.points,
        streakDays: user.streakDays,
        dailyGoal: user.dailyGoal,
        completedLessons: user.completedLessons
      },
      dailyProgress: {
        minutesStudied: minutesStudiedToday,
        goalMinutes: user.dailyGoal,
        progressPercentage: Math.min(100, Math.round((minutesStudiedToday / user.dailyGoal) * 100))
      },
      recentActivities,
      recommendations: recommendations.slice(0, 3),
      stats: {
        totalLessons,
        completedLessons: lessonProgress.filter(p => p.completed).length,
        vocabularyLearned: vocabularyProgress.length,
        currentStreak: user.streakDays,
        totalPoints: user.points
      }
    };

    return res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch dashboard data' }
    });
  }
}

export default authMiddleware(handler);
