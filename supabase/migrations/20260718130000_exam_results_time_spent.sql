-- Persist time-on-exam: all submitters send timeSpent (seconds) but the table
-- had no column for it, so the value was silently discarded.
ALTER TABLE public.exam_results ADD COLUMN IF NOT EXISTS time_spent INTEGER;

-- /api/exam/modules filters lessons with an array-overlap on topics;
-- a GIN index keeps that query index-driven as the curriculum grows.
CREATE INDEX IF NOT EXISTS idx_lessons_topics ON public.lessons USING GIN (topics);
