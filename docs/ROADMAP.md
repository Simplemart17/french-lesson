# French Tutor AI — A1 → C2 Roadmap

## Vision

A learner should be able to use **only this app** to go from complete beginner (A1) to
mastery (C2). The app must behave like a real tutor: it knows the learner's level, teaches
in a structured progression, gives honest feedback on every skill (reading, writing,
listening, speaking), schedules review so knowledge sticks, and prepares the learner for
real exams (TCF/TEF).

## Baseline audit (July 2026)

The architecture is sound — real OpenAI + Supabase wiring, working auth, clean build,
deployed on Vercel. What blocked the vision:

1. **Empty curriculum** — no seed data; `lessons`, `vocabulary`, `grammar_rules`,
   `conversation_templates`, `pronunciation_exercises` all shipped with zero rows, so the
   structured learning path was unreachable.
2. **Dishonest feedback** — the exam speaking recorder was simulated, most pronunciation
   scores were text string-matching (not derived from audio), skill levels on the progress
   page were padded with hardcoded offsets, and one API scored 100% when it received no
   transcript.
3. **Broken persistence** — exam results were never saved (payload/validation mismatch),
   the progress API read user rows with the anon client so RLS returned nothing, and
   activity recording inserted into a column that doesn't exist.

## Phase 1 — Truthful and persistent (fix everything that lies or loses data)

- [x] `/api/user/progress`: use the service-role client, fix `french/english` and
      `completed_at` field mismatches, derive skill levels from real activity (no padding).
- [x] `progressTracker.recordActivity`: write to real `practice_sessions` columns.
- [x] Exam results: align client payload with `/api/exam/results` validation and actually
      POST results from the exam flows.
- [x] Replace the simulated exam `AudioRecorder` with a real `MediaRecorder` implementation.
- [x] Remove the 100%-on-missing-transcript fallback in `/api/speech/pronunciation`.
- [x] Route pronunciation practice through the real Whisper + GPT analysis pipeline.
- [x] Delete or repair dead simulated components (`PronunciationExercise` random scores,
      `AdvancedPronunciationPractice` fake transcript, `EnhancedSpeechRecognition`).
- [x] Replace the static "Skill Assessment" copy on the progress page with data-driven text.

## Phase 2 — Curriculum and content (make A1→C2 reachable)

- [x] Seed migration: ordered lesson curriculum for every CEFR level, core vocabulary,
      grammar rules, conversation templates, pronunciation exercises.
- [x] `order_index` on lessons + a learning-path API: "your level, your next lesson,
      what unlocks the next level".
- [ ] Expand seed depth per level (target: 25–40 lessons per level; seed ships the spine —
      AI generation fills sections/exercises on demand and persists them).
- [x] Level-completion gates: `/api/learning/path` advances the user's CEFR level when
      ≥80% of the level's lessons are done and the checkpoint lesson is passed (≥60%).

## Phase 3 — Tutor intelligence (the app behaves like a person who knows you)

- [x] Level-aware tutor chat: system prompt includes the learner's CEFR level, goals, and
      recent weak points; tutor adapts language complexity accordingly.
- [x] Spaced repetition scheduling: expanding review intervals (1→120 days) via
      `user_vocabulary.next_review_date` / `repetition_stage`; the vocabulary page's
      review mode and the dashboard's due-count consume it.
- [ ] Weak-point targeting: aggregate error categories from grammar/writing/pronunciation
      feedback into a per-user model; generate targeted drills from it.
- [ ] Adaptive difficulty: exercise generation reads recent accuracy and adjusts.
- [ ] Daily study plan on the dashboard: review queue + next lesson + one skill exercise,
      sized to the user's `daily_goal` minutes.

## Phase 4 — Exam mastery (TCF/TEF)

- [x] Real audio for listening modules (TTS-generated) and timed exam-practice modules.
- [x] Persist graded exam attempts (module practice and simulations, one row per
      section); per-section progress shows on the exam-practice page. Writing/speaking
      modules persist once AI scoring (below) exists.
- [ ] Unify the exam-results section taxonomy: simulations store category names
      (comprehension/grammar/vocabulary) while module practice stores TCF sections
      (listening/reading/writing/speaking) in `exam_results.module`.
- [ ] AI-scored expression écrite (rubric-based CEFR scoring of writing tasks).
- [ ] AI-scored expression orale (Whisper transcription + rubric scoring of recordings).
- [ ] Full-length timed mock exams with CEFR-equivalent score reports.

## Phase 5 — Method breadth ("all necessary methods")

- [ ] Dictation exercises at every level (TTS audio → typed transcription, auto-scored).
- [ ] Graded reading passages with tap-to-translate and comprehension questions.
- [ ] Shadowing mode: hear a phrase, record an imitation, Whisper-score the match.
- [ ] Verb-conjugation trainer backed by SRS.
- [ ] Streak/goal mechanics tied to the daily plan (already have `points`/`streak_days`).

## Platform hygiene

- [x] Modernize OpenAI models (`gpt-4-turbo`/`gpt-4` → `gpt-4o` / `gpt-4o-mini`).
- [x] Cache TTS audio (deterministic cache headers so the CDN/browser stops re-billing).
- [ ] Unit/integration tests for the API layer.
- [ ] Error monitoring (Sentry) on API routes.

Checked items were completed in the July 2026 improvement pass on `ft-app-improvement`.
Unchecked items are the follow-up backlog, in priority order within each phase.
