import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/utils/authMiddleware';
import { getUserId } from '@/utils/auth';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { getOrCreateUserProfile } from '@/utils/userProfile';
import {
  CHECKPOINT_PASS_SCORE,
  CHECKPOINT_TOPIC,
  LESSON_PASS_SCORE,
  LEVEL_COMPLETION_RATIO,
  isCefrLevel,
  nextLevelOf
} from '@/lib/curriculum';

interface LessonRow {
  id: string;
  title: string;
  description: string | null;
  level: string;
  duration: number | null;
  topics: string[] | null;
  order_index: number | null;
  lesson_progress?: ProgressRow[];
}

interface ProgressRow {
  completed: boolean;
  score: number | null;
}

interface PathLesson {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  topics: string[];
  orderIndex: number;
  isCheckpoint: boolean;
  completed: boolean;
  score: number | null;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  // One round trip: lessons with the user's progress embedded (left join, so
  // lessons without a progress row still come back with an empty array).
  const lessonResult = await db
    .from(TABLES.LESSONS)
    .select(`id, title, description, level, duration, topics, order_index, ${TABLES.LESSON_PROGRESS}(completed, score)`)
    .eq('level', level)
    .eq(`${TABLES.LESSON_PROGRESS}.user_id`, userId)
    .order('order_index', { ascending: true });

  if (lessonResult.error) {
    console.error('Error fetching learning path:', lessonResult.error);
    return res.status(500).json({ success: false, error: { message: 'Failed to fetch learning path' } });
  }

  const lessons = (lessonResult.data || []) as unknown as LessonRow[];

  const pathLessons: PathLesson[] = lessons.map((lesson) => {
    const progress = lesson.lesson_progress?.[0];
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration || 15,
      topics: lesson.topics || [],
      orderIndex: lesson.order_index || 0,
      isCheckpoint: (lesson.topics || []).includes(CHECKPOINT_TOPIC),
      completed: Boolean(progress?.completed),
      score: progress?.score ?? null
    };
  });

  const completedCount = pathLessons.filter((l) => l.completed).length;
  const nextLesson = pathLessons.find((l) => !l.completed) || null;
  const checkpoint = pathLessons.filter((l) => l.isCheckpoint).pop() || null;
  const regularLessons = pathLessons.filter((l) => !l.isCheckpoint);
  const regularCompleted = regularLessons.filter(
    (l) => l.completed && (l.score === null || Number(l.score) >= LESSON_PASS_SCORE)
  ).length;
  const checkpointPassed = Boolean(
    checkpoint && checkpoint.completed && Number(checkpoint.score ?? 0) >= CHECKPOINT_PASS_SCORE
  );
  const nextLevel = nextLevelOf(level);
  // Advance when the level checkpoint is passed and most regular lessons are done
  const canAdvance = Boolean(
    nextLevel &&
    checkpointPassed &&
    regularLessons.length > 0 &&
    regularCompleted >= Math.ceil(regularLessons.length * LEVEL_COMPLETION_RATIO)
  );

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: {
        level,
        nextLevel,
        lessons: pathLessons,
        totalLessons: pathLessons.length,
        completedLessons: completedCount,
        progressPercent: pathLessons.length > 0 ? Math.round((completedCount / pathLessons.length) * 100) : 0,
        nextLesson,
        checkpointPassed,
        canAdvance
      }
    });
  }

  if (req.method === 'POST') {
    // Advance the user's CEFR level once the current level is mastered
    if (!canAdvance || !nextLevel) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Level requirements not met yet: complete the lessons and pass the checkpoint first.'
        }
      });
    }

    const { error: updateError } = await db
      .from(TABLES.USERS)
      .update({ level: nextLevel, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) {
      console.error('Error advancing user level:', updateError);
      return res.status(500).json({ success: false, error: { message: 'Failed to update level' } });
    }

    return res.status(200).json({
      success: true,
      data: { level: nextLevel, message: `Félicitations ! You have advanced to ${nextLevel}.` }
    });
  }

  return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
}

export default authMiddleware(handler);
