/**
 * Single source of truth for curriculum-wide conventions.
 *
 * IMPORTANT: CHECKPOINT_TOPIC and EXAM_TOPICS are coupled to the lesson topics
 * seeded in supabase/migrations/20260718120000_curriculum_seed.sql — a lesson is
 * a level checkpoint / exam module only if its topics include these markers.
 */

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

/** Lessons carrying this topic are level checkpoints (and exam modules). */
export const CHECKPOINT_TOPIC = 'exam';

/** Topics that mark a lesson as TCF/TEF exam content. */
export const EXAM_TOPICS = ['exam', 'tcf', 'tef'];

/** Minimum checkpoint score (percent) required to advance a CEFR level. */
export const CHECKPOINT_PASS_SCORE = 60;

/** Minimum lesson score (percent) counted toward level completion. */
export const LESSON_PASS_SCORE = 50;

/** Share of a level's regular lessons that must be passed to advance. */
export const LEVEL_COMPLETION_RATIO = 0.8;

export function isCefrLevel(value: string | null | undefined): value is CefrLevel {
  return Boolean(value && (CEFR_LEVELS as readonly string[]).includes(value));
}

export function nextLevelOf(level: string): CefrLevel | null {
  const index = (CEFR_LEVELS as readonly string[]).indexOf(level);
  if (index === -1 || index === CEFR_LEVELS.length - 1) return null;
  return CEFR_LEVELS[index + 1];
}

export type ExamDifficulty = 'easy' | 'medium' | 'hard';

export function difficultyForLevel(level: string): ExamDifficulty {
  if (level === 'A1' || level === 'A2') return 'easy';
  if (level === 'B1' || level === 'B2') return 'medium';
  return 'hard';
}

/** Representative CEFR level for a difficulty bucket (lossy inverse of difficultyForLevel). */
export function levelForDifficulty(difficulty: string): CefrLevel {
  if (difficulty === 'easy') return 'A2';
  if (difficulty === 'medium') return 'B1';
  return 'C1';
}
