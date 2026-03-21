-- RLS hardening for content and profile lifecycle tables
-- This migration:
-- 1) Enables RLS on content tables that previously had no RLS.
-- 2) Adds explicit read-only policies for anon/authenticated users on content tables.
-- 3) Adds a users INSERT policy to allow authenticated users to create their own profile row.
-- 4) Adds explicit DELETE policies for user-owned private tables.

-- 1) Enable RLS on content tables
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pronunciation_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_exercises ENABLE ROW LEVEL SECURITY;

-- 2) Explicit read-only policies for content tables
DROP POLICY IF EXISTS "Public read lessons" ON public.lessons;
CREATE POLICY "Public read lessons"
  ON public.lessons
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public read lesson sections" ON public.lesson_sections;
CREATE POLICY "Public read lesson sections"
  ON public.lesson_sections
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public read vocabulary" ON public.vocabulary;
CREATE POLICY "Public read vocabulary"
  ON public.vocabulary
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public read conversation templates" ON public.conversation_templates;
CREATE POLICY "Public read conversation templates"
  ON public.conversation_templates
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public read pronunciation exercises" ON public.pronunciation_exercises;
CREATE POLICY "Public read pronunciation exercises"
  ON public.pronunciation_exercises
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public read grammar rules" ON public.grammar_rules;
CREATE POLICY "Public read grammar rules"
  ON public.grammar_rules
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public read lesson exercises" ON public.lesson_exercises;
CREATE POLICY "Public read lesson exercises"
  ON public.lesson_exercises
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3) Allow authenticated users to create their own users profile row
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 4) Explicit DELETE policies for user-owned tables
DROP POLICY IF EXISTS "Users can delete own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can delete own lesson progress"
  ON public.lesson_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vocabulary progress" ON public.user_vocabulary;
CREATE POLICY "Users can delete own vocabulary progress"
  ON public.user_vocabulary
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own conversations" ON public.conversations;
CREATE POLICY "Users can delete own conversations"
  ON public.conversations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete messages in own conversations" ON public.messages;
CREATE POLICY "Users can delete messages in own conversations"
  ON public.messages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.conversations
      WHERE conversations.id = messages.conversation_id
        AND conversations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own practice items" ON public.practice_items;
CREATE POLICY "Users can delete own practice items"
  ON public.practice_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own practice sessions" ON public.practice_sessions;
CREATE POLICY "Users can delete own practice sessions"
  ON public.practice_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own pronunciation practice" ON public.pronunciation_practice_items;
CREATE POLICY "Users can delete own pronunciation practice"
  ON public.pronunciation_practice_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own exam results" ON public.exam_results;
CREATE POLICY "Users can delete own exam results"
  ON public.exam_results
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

