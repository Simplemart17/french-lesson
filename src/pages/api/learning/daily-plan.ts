import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/utils/authMiddleware';
import { getUserId } from '@/utils/auth';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { getOrCreateUserProfile } from '@/utils/userProfile';
import { isCefrLevel } from '@/lib/curriculum';

interface PlanItem {
  type: 'reviews' | 'lesson' | 'drill';
  title: string;
  description: string;
  minutes: number;
  href: string;
}

const DRILL_LINKS: Record<string, { title: string; href: string }> = {
  pronunciation: { title: 'Pronunciation drill', href: '/pronunciation/ai' },
  speaking: { title: 'Speaking practice', href: '/chat' },
  chat: { title: 'Conversation practice', href: '/chat' },
  conversation: { title: 'Conversation practice', href: '/chat' },
  grammar: { title: 'Grammar drill', href: '/practice/weak-points' },
  vocabulary: { title: 'Vocabulary drill', href: '/practice/weak-points' },
  listening: { title: 'Listening practice', href: '/listening' },
  writing: { title: 'Writing practice', href: '/writing' },
  reading: { title: 'Reading practice', href: '/reading' }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: { message: 'User not authenticated' } });
    }

    const { data: user, error: userError } = await getOrCreateUserProfile(userId);
    if (userError || !user) {
      return res.status(500).json({ success: false, error: { message: 'Failed to fetch user profile' } });
    }

    const db = supabaseAdmin ?? supabase;
    const level: string = isCefrLevel(user.level) ? user.level : 'A1';
    const dailyGoal: number = Number(user.daily_goal) || 15;

    const [dueResult, lessonResult, sessionResult] = await Promise.all([
      db
        .from(TABLES.USER_VOCABULARY)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .lte('next_review_date', new Date().toISOString()),
      db
        .from(TABLES.LESSONS)
        .select(`id, title, duration, ${TABLES.LESSON_PROGRESS}(completed)`)
        .eq('level', level)
        .eq(`${TABLES.LESSON_PROGRESS}.user_id`, userId)
        .order('order_index', { ascending: true }),
      db
        .from(TABLES.PRACTICE_SESSIONS)
        .select('type, score')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30)
    ]);

    const dueReviews = dueResult.count || 0;

    interface LessonWithProgress {
      id: string;
      title: string;
      duration: number | null;
      lesson_progress?: Array<{ completed: boolean }>;
    }
    const nextLesson = ((lessonResult.data || []) as unknown as LessonWithProgress[])
      .find((lesson) => !lesson.lesson_progress?.[0]?.completed) || null;

    // Weakest recently-practiced area: lowest average score across recent sessions
    const scoresByType = new Map<string, number[]>();
    for (const session of (sessionResult.data || []) as Array<{ type: string; score: number | null }>) {
      if (typeof session.score === 'number' && DRILL_LINKS[session.type]) {
        const list = scoresByType.get(session.type) || [];
        list.push(session.score);
        scoresByType.set(session.type, list);
      }
    }
    let weakestType: string | null = null;
    let weakestAvg = Infinity;
    for (const [type, scores] of Array.from(scoresByType.entries())) {
      const avg = scores.reduce((sum: number, s: number) => sum + s, 0) / scores.length;
      if (avg < weakestAvg) {
        weakestAvg = avg;
        weakestType = type;
      }
    }

    // Compose the plan within the user's daily-goal minutes
    const items: PlanItem[] = [];
    let remaining = dailyGoal;

    if (dueReviews > 0) {
      const minutes = Math.min(Math.max(Math.ceil(dueReviews / 4), 2), 10, remaining);
      items.push({
        type: 'reviews',
        title: `Review ${dueReviews} word${dueReviews === 1 ? '' : 's'}`,
        description: 'Spaced-repetition reviews due today',
        minutes,
        href: '/vocabulary'
      });
      remaining -= minutes;
    }

    if (nextLesson && remaining > 0) {
      const minutes = Math.min(nextLesson.duration || 15, Math.max(remaining, 5));
      items.push({
        type: 'lesson',
        title: nextLesson.title,
        description: `Your next ${level} lesson`,
        minutes,
        href: `/lessons/${nextLesson.id}`
      });
      remaining -= minutes;
    }

    const drill = weakestType ? DRILL_LINKS[weakestType] : null;
    if (drill && remaining > 0) {
      items.push({
        type: 'drill',
        title: drill.title,
        description: `Recent scores suggest ${weakestType} needs attention`,
        minutes: Math.min(10, remaining),
        href: drill.href
      });
    } else if (items.length === 0) {
      // Brand-new user with nothing due: point them at the path
      items.push({
        type: 'lesson',
        title: 'Start your learning path',
        description: `Begin the ${level} curriculum`,
        minutes: dailyGoal,
        href: '/lessons'
      });
    }

    // Streak nudge: active yesterday (or earlier) but not yet today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = user.last_active ? new Date(user.last_active) : null;
    const streakAtRisk = Boolean(
      lastActive && lastActive.getTime() < today.getTime() && (user.streak_days || 0) > 0
    );

    return res.status(200).json({
      success: true,
      data: {
        level,
        dailyGoal,
        dueReviews,
        streakDays: user.streak_days || 0,
        streakAtRisk,
        weakestArea: weakestType,
        items
      }
    });
  } catch (error) {
    console.error('Error building daily plan:', error);
    return res.status(500).json({ success: false, error: { message: 'Failed to build daily plan' } });
  }
}

export default authMiddleware(handler);
