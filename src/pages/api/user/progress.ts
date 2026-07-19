import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '../../../utils/authMiddleware';
import { getUserId } from '@/utils/auth';
import { supabase, supabaseAdmin, TABLES } from '../../../lib/supabase';
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

interface LessonProgressRow {
  id: string;
  completed: boolean;
  score: number | null;
  completed_at: string | null;
  started_at: string | null;
  created_at: string | null;
  lesson?: {
    title?: string;
    duration?: number;
    topics?: string[];
  };
}

interface VocabularyProgressRow {
  id: string;
  last_practiced: string | null;
  created_at: string | null;
  vocabulary?: {
    french?: string;
    english?: string;
    pronunciation?: string;
    category?: string;
    level?: string;
  };
}

interface PracticeSessionRow {
  id: string;
  type: string;
  duration: number | null;
  score: number | null;
  created_at: string | null;
}

const SESSION_LABELS: Record<string, { activity: string; category: ActivityLog['category'] }> = {
  lesson: { activity: 'Lesson practice', category: 'reading' },
  chat: { activity: 'AI tutor chat', category: 'speaking' },
  conversation: { activity: 'Conversation practice', category: 'speaking' },
  grammar: { activity: 'Grammar practice', category: 'grammar' },
  pronunciation: { activity: 'Pronunciation practice', category: 'speaking' },
  listening: { activity: 'Listening practice', category: 'listening' },
  vocabulary: { activity: 'Vocabulary practice', category: 'vocabulary' },
  exam_prep: { activity: 'Exam practice', category: 'reading' },
  speaking: { activity: 'Speaking assessment', category: 'speaking' },
  writing: { activity: 'Writing assessment', category: 'writing' },
  reading: { activity: 'Reading practice', category: 'reading' },
};

// Honest skill estimate: 0 with no activity, grows with practice volume,
// with up to 30 points coming from average scores on that skill.
function skillLevel(lessonCount: number, sessionCount: number, avgScore: number | null): number {
  const activity = Math.min(70, lessonCount * 10 + sessionCount * 3);
  const quality = avgScore !== null ? Math.round((Math.min(100, avgScore) / 100) * 30) : 0;
  return activity === 0 && quality === 0 ? 0 : Math.min(100, activity + quality);
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

    // Server-side reads must use the service-role client: the anon client has no
    // user session here, so RLS on user-owned tables would return zero rows.
    const db = supabaseAdmin ?? supabase;

    const [lessonResult, vocabResult, sessionResult] = await Promise.all([
      db
        .from(TABLES.LESSON_PROGRESS)
        .select(`
          id, completed, score, completed_at, started_at, created_at,
          lesson:lesson_id (
            title,
            duration,
            topics
          )
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(20),
      db
        .from(TABLES.USER_VOCABULARY)
        .select(`
          id, last_practiced, created_at,
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
        .limit(50),
      db
        .from(TABLES.PRACTICE_SESSIONS)
        .select('id, type, duration, score, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
    ]);

    if (lessonResult.error) {
      console.error('Error fetching lesson progress:', lessonResult.error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch lesson progress' }
      });
    }
    if (vocabResult.error) {
      console.error('Error fetching vocabulary progress:', vocabResult.error);
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to fetch vocabulary progress' }
      });
    }
    if (sessionResult.error) {
      console.error('Error fetching practice sessions:', sessionResult.error);
    }

    const lessonProgress = (lessonResult.data || []) as LessonProgressRow[];
    const vocabularyProgress = (vocabResult.data || []) as VocabularyProgressRow[];
    const practiceSessions = (sessionResult.data || []) as PracticeSessionRow[];

    const completedLessonsByTopic = (topic: string) =>
      lessonProgress.filter((p) => p.completed && p.lesson?.topics?.includes(topic)).length;

    const sessionsOfType = (types: string[]) =>
      practiceSessions.filter((s) => types.includes(s.type));

    const avgScore = (rows: Array<{ score: number | null }>): number | null => {
      const scores = rows.map((r) => r.score).filter((s): s is number => typeof s === 'number');
      if (scores.length === 0) return null;
      return scores.reduce((sum, s) => sum + s, 0) / scores.length;
    };

    const pronunciationSessions = sessionsOfType(['pronunciation']);
    const conversationSessions = sessionsOfType(['chat', 'conversation', 'speaking']);
    const listeningSessions = sessionsOfType(['listening']);
    const grammarSessions = sessionsOfType(['grammar']);
    const vocabularySessions = sessionsOfType(['vocabulary']);
    const writingSessions = sessionsOfType(['writing']);
    const readingSessions = sessionsOfType(['reading']);
    const completedLessons = lessonProgress.filter((p) => p.completed);

    const skillProgress: SkillProgress[] = [
      {
        name: 'Pronunciation',
        level: skillLevel(completedLessonsByTopic('pronunciation'), pronunciationSessions.length, avgScore(pronunciationSessions)),
        category: 'speaking'
      },
      {
        name: 'Conversation',
        level: skillLevel(completedLessonsByTopic('conversation'), conversationSessions.length, avgScore(conversationSessions)),
        category: 'speaking'
      },
      {
        name: 'Comprehension',
        level: skillLevel(completedLessonsByTopic('listening'), listeningSessions.length, avgScore(listeningSessions)),
        category: 'listening'
      },
      {
        name: 'Reading',
        level: skillLevel(
          completedLessonsByTopic('reading'),
          readingSessions.length,
          avgScore([
            ...completedLessons.filter((p) => p.lesson?.topics?.includes('reading')),
            ...readingSessions
          ])
        ),
        category: 'reading'
      },
      {
        name: 'Writing',
        level: skillLevel(completedLessonsByTopic('writing'), writingSessions.length, avgScore(writingSessions)),
        category: 'writing'
      },
      {
        name: 'Vocabulary',
        level: skillLevel(Math.floor(vocabularyProgress.length / 2), vocabularySessions.length, avgScore(vocabularySessions)),
        category: 'vocabulary'
      },
      {
        name: 'Grammar',
        level: skillLevel(completedLessonsByTopic('grammar'), grammarSessions.length, avgScore(grammarSessions)),
        category: 'grammar'
      }
    ];

    // Build activity log from real data only; entries with no usable date are dropped
    const activityLog: ActivityLog[] = [
      ...lessonProgress
        .filter((p) => p.completed)
        .map((progress) => ({
          id: progress.id,
          date: (progress.completed_at || progress.started_at || progress.created_at || '').split('T')[0],
          activity: `Completed Lesson: ${progress.lesson?.title || 'Lesson'}`,
          duration: progress.lesson?.duration || 15,
          xpEarned: Math.round(progress.score ?? 0),
          category: determineCategory(progress.lesson?.topics || [])
        })),
      ...vocabularyProgress.slice(0, 10).map((vocab) => ({
        id: `vocab-${vocab.id}`,
        date: (vocab.last_practiced || vocab.created_at || '').split('T')[0],
        activity: `Learned new word: ${vocab.vocabulary?.french || 'Word'}`,
        duration: 2,
        xpEarned: 5,
        category: 'vocabulary' as const
      })),
      ...practiceSessions.slice(0, 20).map((session) => {
        const label = SESSION_LABELS[session.type] || { activity: 'Practice session', category: undefined };
        return {
          id: `session-${session.id}`,
          date: (session.created_at || '').split('T')[0],
          activity: label.activity,
          duration: session.duration || 5,
          xpEarned: session.score != null ? Math.round(session.score / 10) : 0,
          category: label.category
        };
      })
    ]
      .filter((entry) => entry.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);

    // Generate daily progress from activity log, ensuring at least the last 7 days are present
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

    // Ensure the last 7 days are always present (fill gaps with 0 values)
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (!dailyProgressMap[dateStr]) {
        dailyProgressMap[dateStr] = {
          date: dateStr,
          xp: 0,
          minutes: 0
        };
      }
    }

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
