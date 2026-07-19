import { TABLES } from '@/lib/supabase';

type SupabaseClient = {
  from: (table: string) => {
    insert: (data: Record<string, unknown>) => { select: (columns?: string) => { single: () => Promise<{ data: unknown; error: unknown }> } };
    select: (columns: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: Record<string, unknown> | null; error: unknown }> } };
    update: (data: Record<string, unknown>) => { eq: (col: string, val: string) => Promise<{ error: unknown }> };
  };
};

type ActivityType = 'lesson' | 'chat' | 'conversation' | 'grammar' | 'pronunciation' | 'listening' | 'vocabulary' | 'speaking' | 'writing' | 'reading';

/**
 * Record a practice activity in the practice_sessions table.
 * Wrapped in try/catch so failures never break the calling endpoint.
 */
export async function recordActivity(
  db: SupabaseClient,
  userId: string,
  type: ActivityType,
  score?: number,
  metadata?: Record<string, unknown>,
  durationMinutes?: number
): Promise<void> {
  try {
    // practice_sessions has no metadata column; details go in the items JSONB
    await db
      .from(TABLES.PRACTICE_SESSIONS)
      .insert({
        user_id: userId,
        type,
        score: score ?? null,
        items: metadata ?? null,
        duration: durationMinutes ?? null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
  } catch (err) {
    console.error('Failed to record activity:', err);
  }
}

/**
 * Update user XP and streak.
 * Extracted from lessons/[id]/submit.ts so it can be reused across endpoints.
 */
export async function updateUserXpAndStreak(
  db: SupabaseClient,
  userId: string,
  xpAmount: number
): Promise<void> {
  try {
    const { data: userData } = await db
      .from(TABLES.USERS)
      .select('points, streak_days, last_active')
      .eq('id', userId)
      .single();

    if (!userData) return;

    const newPoints = ((userData.points as number) || 0) + xpAmount;

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = userData.last_active ? new Date(userData.last_active as string) : null;
    if (lastActive) lastActive.setHours(0, 0, 0, 0);

    let newStreak = (userData.streak_days as number) || 0;
    if (!lastActive) {
      newStreak = 1;
    } else {
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
      // diffDays === 0: same day, keep current streak
    }

    await db
      .from(TABLES.USERS)
      .update({
        points: newPoints,
        streak_days: newStreak,
        last_active: new Date().toISOString()
      })
      .eq('id', userId);
  } catch (err) {
    console.error('Failed to update XP/streak:', err);
  }
}
