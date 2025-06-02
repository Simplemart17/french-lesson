import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { getSupabaseClient, TABLES } from '@/lib/supabase';
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

    // Production mode: Use Supabase
    const supabase = getSupabaseClient();

    // Get user data
    const { data: user, error: userError } = await supabase
      .from(TABLES.USERS)
      .select('name, level, points, streakDays, dailyGoal, completedLessons, lastActive')
      .eq('id', userId)
      .single();

      console.log(user, "Is there user in the database")
      console.log(userError, "what error exist here")

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Get lesson progress
    const { data: lessonProgress, error: progressError } = await supabase
      .from(TABLES.LESSON_PROGRESS)
      .select(`
        *,
        lesson:${TABLES.LESSONS}(title, duration)
      `)
      .eq('userId', userId)
      .order('completedAt', { ascending: false })
      .limit(10);

    if (progressError) {
      console.error('Error fetching lesson progress:', progressError);
    }

    // Get vocabulary progress
    const { data: vocabularyProgress, error: vocabError } = await supabase
      .from(TABLES.USER_VOCABULARY)
      .select(`
        *,
        vocabulary:${TABLES.VOCABULARY}(french, english)
      `)
      .eq('userId', userId)
      .eq('learned', true)
      .order('lastPracticed', { ascending: false })
      .limit(5);

    if (vocabError) {
      console.error('Error fetching vocabulary progress:', vocabError);
    }

    // Calculate daily progress (simplified - you might want to track actual study time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: todayProgress, error: todayError } = await supabase
      .from(TABLES.LESSON_PROGRESS)
      .select(`
        *,
        lesson:${TABLES.LESSONS}(duration)
      `)
      .eq('userId', userId)
      .gte('completedAt', today.toISOString());

    if (todayError) {
      console.error('Error fetching today progress:', todayError);
    }

    const minutesStudiedToday = (todayProgress || []).reduce((total, progress: any) => {
      return total + (progress.lesson?.duration || 0);
    }, 0);

    // Get total lesson count
    const { count: totalLessons, error: countError } = await supabase
      .from(TABLES.LESSONS)
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error fetching lesson count:', countError);
    }

    // Build recent activities
    const recentActivities = [
      ...(lessonProgress || []).slice(0, 5).map((progress: any) => ({
        id: `lesson-${progress.id}`,
        type: 'lesson' as const,
        title: `Completed Lesson: ${progress.lesson?.title || 'Unknown Lesson'}`,
        description: `Score: ${progress.score || 0}%`,
        timestamp: progress.completedAt || new Date().toISOString(),
        score: progress.score
      })),
      ...(vocabularyProgress || []).slice(0, 3).map((vocab: any) => ({
        id: `vocab-${vocab.id}`,
        type: 'vocabulary' as const,
        title: `Learned new word: ${vocab.vocabulary?.french || 'Unknown Word'}`,
        description: 'Added to vocabulary',
        timestamp: vocab.lastPracticed || new Date().toISOString()
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

    // Generate recommendations based on user level and progress
    const recommendations = [];
    
    // Get completed lesson IDs
    const completedLessonIds = (lessonProgress || [])
      .filter((p: any) => p.completed)
      .map((p: any) => p.lessonId);

    // Get next lesson recommendation
    let nextLessonQuery = supabase
      .from(TABLES.LESSONS)
      .select('id, title, description, duration')
      .eq('level', user.level)
      .order('id', { ascending: true })
      .limit(1);

    if (completedLessonIds.length > 0) {
      nextLessonQuery = nextLessonQuery.not('id', 'in', `(${completedLessonIds.join(',')})`);
    }

    const { data: nextLessons, error: nextLessonError } = await nextLessonQuery;

    if (nextLessonError) {
      console.error('Error fetching next lesson:', nextLessonError);
    }

    const nextLesson = nextLessons?.[0];

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
    const { count: vocabularyToReview, error: vocabReviewError } = await supabase
      .from(TABLES.USER_VOCABULARY)
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)
      .lte('nextReviewDate', new Date().toISOString());

    if (vocabReviewError) {
      console.error('Error fetching vocabulary to review:', vocabReviewError);
    }

    if ((vocabularyToReview || 0) > 0) {
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
        totalLessons: totalLessons || 0,
        completedLessons: (lessonProgress || []).filter((p: any) => p.completed).length,
        vocabularyLearned: (vocabularyProgress || []).length,
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
