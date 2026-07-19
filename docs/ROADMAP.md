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
- [x] Self-expanding curriculum: `/api/lessons/expand` generates new lesson rows for the
      learner's level (capped at 40/level, gated on 60% completion), surfaced as a
      "Generate more lessons" action on the learning path.
- [x] Level-completion gates: `/api/learning/path` advances the user's CEFR level when
      ≥80% of the level's lessons are done and the checkpoint lesson is passed (≥60%).

## Phase 3 — Tutor intelligence (the app behaves like a person who knows you)

- [x] Level-aware tutor chat: system prompt includes the learner's CEFR level, goals, and
      recent weak points; tutor adapts language complexity accordingly.
- [x] Spaced repetition scheduling: expanding review intervals (1→120 days) via
      `user_vocabulary.next_review_date` / `repetition_stage`; the vocabulary page's
      review mode and the dashboard's due-count consume it.
- [x] Weak-point targeting: `/api/practice/weak-points` finds the learner's lowest-scoring
      areas from practice/exam history and generates targeted drills (`/practice/weak-points`).
- [x] Adaptive difficulty: drill generation reads recent accuracy and pitches slightly
      easier or harder accordingly.
- [x] Daily study plan on the dashboard: review queue + next lesson + weakest-skill drill,
      sized to `daily_goal` minutes, with a streak-at-risk nudge.
- [x] Voice tutor: microphone input (Whisper-transcribed) and spoken replies (TTS) in the
      tutor chat — a real conversation partner.
- [x] Vocabulary inflow: words the tutor flags in conversation are added to the learner's
      SRS deck automatically.

## Phase 4 — Exam mastery (TCF/TEF)

- [x] Real audio for listening modules (TTS-generated) and timed exam-practice modules.
- [x] Persist graded exam attempts (module practice and simulations, one row per
      section); per-section progress shows on the exam-practice page. Writing/speaking
      modules persist once AI scoring (below) exists.
- [x] Unified exam-results section taxonomy: simulations now aggregate and store results
      under the canonical listening/reading/writing/speaking sections.
- [x] AI-scored expression écrite: `/api/ai/writing-assessment` scores essays against a
      CEFR rubric with corrections; exam writing modules persist the averaged score.
- [x] AI-scored expression orale: `/api/ai/speaking-assessment` (Whisper + rubric) scores
      recordings; exam speaking modules persist the averaged score, and passing both
      production skills gates advancement from B1 upward.
- [x] Timed simulations now end with a CEFR-equivalent estimate report (overall +
      per-section).

## Phase 5 — Method breadth ("all necessary methods")

- [x] Graded reading (`/reading`): AI-written passages at the learner's level with
      tap-to-translate glossaries and scored comprehension questions.
- [x] Shadowing mode (`/pronunciation/shadowing`): hear a phrase, record an imitation,
      Whisper-score the match.
- [x] Streak/goal mechanics tied to the daily plan (streak-at-risk nudge on the dashboard).
- [ ] Dictation exercises at every level (basic dictation exists on the listening page;
      needs level coverage and SRS integration).
- [ ] Verb-conjugation trainer backed by SRS.
- [ ] Email/push practice reminders (needs a provider decision).

## Phase 6 — The last mile to C1/C2

The app is a legitimate standalone tutor through B2. What separates it from
"solely this app, all the way to C2" is live speech and authentic input — the
two things C-levels are defined by. In impact order:

- [ ] **Real-time speech-to-speech conversation.** Replace the turn-based
      record→transcribe→reply loop with a live voice conversation mode
      (OpenAI Realtime API): the tutor speaks and listens continuously,
      interrupts and can be interrupted, and adapts register mid-stream.
      This is the single biggest unlock for C-level oral proficiency —
      real-time comprehension under pressure cannot be trained turn-based.
- [ ] **Authentic-material comprehension.** At B2+ supplement generated
      passages with curated authentic input — French podcasts, press
      articles, and video — with AI-generated comprehension questions and
      glossaries layered on top. C-levels are defined by handling
      unadapted native material; generated text alone cannot certify that.
- [ ] **Multi-voice, variable-speed listening.** Rotate TTS voices, add a
      speed control (0.75×–1.25×), and generate multi-speaker dialogues so
      the ear trains on variety rather than one clean studio voice.
      Longer-term: real recorded audio for C-level listening exams.
- [ ] **Calibrate the rubric scores.** Compare a sample of the app's
      speaking/writing CEFR estimates against real TCF/TEF outcomes (or a
      certified examiner's ratings) and adjust the rubric prompts and gate
      thresholds. Until then, estimates stay honestly labeled as indicative.
- [ ] **Retention infrastructure.** Practice reminders (email/push — the
      provider decision above) so the daily plan reaches learners who
      didn't open the app; solo-learning attrition is the practical killer
      above B1.

## Platform hygiene

- [x] Modernize OpenAI models (`gpt-4-turbo`/`gpt-4` → `gpt-4o` / `gpt-4o-mini`).
- [x] Cache TTS audio (deterministic cache headers so the CDN/browser stops re-billing).
- [x] Unit tests for the core logic helpers (curriculum, sanitizers, formatting) via vitest.
- [ ] Integration tests for the API layer.
- [ ] Error monitoring (Sentry) on API routes — needs a DSN decision.

Checked items were completed in the July 2026 improvement pass on `ft-app-improvement`.
Unchecked items are the follow-up backlog, in priority order within each phase.
