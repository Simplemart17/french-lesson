-- Migration to convert all Int IDs to UUIDs while preserving existing data
-- This migration handles the conversion in phases to maintain referential integrity

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Phase 1: Create mapping tables to store old ID -> new UUID relationships
CREATE TABLE IF NOT EXISTS "_id_mapping_user" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_lesson" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_lesson_section" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_lesson_exercise" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_lesson_progress" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_vocabulary" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_user_vocabulary" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_message" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_conversation_template" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_user_template_usage" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_exam_result" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_practice_item" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_pronunciation_exercise" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_pronunciation_practice_item" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS "_id_mapping_grammar_rule" (
    old_id INTEGER PRIMARY KEY,
    new_id UUID NOT NULL DEFAULT uuid_generate_v4()
);

-- Phase 2: Populate mapping tables with existing data
INSERT INTO "_id_mapping_user" (old_id) 
SELECT id FROM "User" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_lesson" (old_id) 
SELECT id FROM "Lesson" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_lesson_section" (old_id) 
SELECT id FROM "LessonSection" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_lesson_exercise" (old_id) 
SELECT id FROM "LessonExercise" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_lesson_progress" (old_id) 
SELECT id FROM "LessonProgress" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_vocabulary" (old_id) 
SELECT id FROM "Vocabulary" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_user_vocabulary" (old_id) 
SELECT id FROM "UserVocabulary" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_message" (old_id) 
SELECT id FROM "Message" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_conversation_template" (old_id) 
SELECT id FROM "ConversationTemplate" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_user_template_usage" (old_id) 
SELECT id FROM "UserTemplateUsage" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_exam_result" (old_id) 
SELECT id FROM "ExamResult" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_practice_item" (old_id) 
SELECT id FROM "PracticeItem" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_pronunciation_exercise" (old_id) 
SELECT id FROM "PronunciationExercise" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_pronunciation_practice_item" (old_id) 
SELECT id FROM "PronunciationPracticeItem" ON CONFLICT (old_id) DO NOTHING;

INSERT INTO "_id_mapping_grammar_rule" (old_id) 
SELECT id FROM "GrammarRule" ON CONFLICT (old_id) DO NOTHING;

-- Phase 3: Add new UUID columns to all tables
ALTER TABLE "User" ADD COLUMN "new_id" UUID;
ALTER TABLE "Lesson" ADD COLUMN "new_id" UUID;
ALTER TABLE "LessonSection" ADD COLUMN "new_id" UUID;
ALTER TABLE "LessonSection" ADD COLUMN "new_lessonId" UUID;
ALTER TABLE "LessonExercise" ADD COLUMN "new_id" UUID;
ALTER TABLE "LessonExercise" ADD COLUMN "new_sectionId" UUID;
ALTER TABLE "LessonProgress" ADD COLUMN "new_id" UUID;
ALTER TABLE "LessonProgress" ADD COLUMN "new_lessonId" UUID;
ALTER TABLE "LessonProgress" ADD COLUMN "new_userId" UUID;
ALTER TABLE "Vocabulary" ADD COLUMN "new_id" UUID;
ALTER TABLE "UserVocabulary" ADD COLUMN "new_id" UUID;
ALTER TABLE "UserVocabulary" ADD COLUMN "new_userId" UUID;
ALTER TABLE "UserVocabulary" ADD COLUMN "new_vocabularyId" UUID;
ALTER TABLE "Conversation" ADD COLUMN "new_userId" UUID;
ALTER TABLE "Conversation" ADD COLUMN "new_templateId" UUID;
ALTER TABLE "Message" ADD COLUMN "new_id" UUID;
ALTER TABLE "ConversationTemplate" ADD COLUMN "new_id" UUID;
ALTER TABLE "UserTemplateUsage" ADD COLUMN "new_id" UUID;
ALTER TABLE "UserTemplateUsage" ADD COLUMN "new_userId" UUID;
ALTER TABLE "UserTemplateUsage" ADD COLUMN "new_templateId" UUID;
ALTER TABLE "ExamResult" ADD COLUMN "new_id" UUID;
ALTER TABLE "ExamResult" ADD COLUMN "new_userId" UUID;
ALTER TABLE "PracticeSession" ADD COLUMN "new_userId" UUID;
ALTER TABLE "PracticeItem" ADD COLUMN "new_id" UUID;
ALTER TABLE "PracticeItem" ADD COLUMN "new_vocabularyId" UUID;
ALTER TABLE "PronunciationExercise" ADD COLUMN "new_id" UUID;
ALTER TABLE "PronunciationPracticeItem" ADD COLUMN "new_id" UUID;
ALTER TABLE "PronunciationPracticeItem" ADD COLUMN "new_exerciseId" UUID;
ALTER TABLE "GrammarRule" ADD COLUMN "new_id" UUID;

-- Phase 4: Populate new UUID columns using mapping tables
UPDATE "User" SET "new_id" = m.new_id FROM "_id_mapping_user" m WHERE "User".id = m.old_id;
UPDATE "Lesson" SET "new_id" = m.new_id FROM "_id_mapping_lesson" m WHERE "Lesson".id = m.old_id;
UPDATE "LessonSection" SET "new_id" = m.new_id FROM "_id_mapping_lesson_section" m WHERE "LessonSection".id = m.old_id;
UPDATE "LessonSection" SET "new_lessonId" = m.new_id FROM "_id_mapping_lesson" m WHERE "LessonSection"."lessonId" = m.old_id;
UPDATE "LessonExercise" SET "new_id" = m.new_id FROM "_id_mapping_lesson_exercise" m WHERE "LessonExercise".id = m.old_id;
UPDATE "LessonExercise" SET "new_sectionId" = m.new_id FROM "_id_mapping_lesson_section" m WHERE "LessonExercise"."sectionId" = m.old_id;
UPDATE "LessonProgress" SET "new_id" = m.new_id FROM "_id_mapping_lesson_progress" m WHERE "LessonProgress".id = m.old_id;
UPDATE "LessonProgress" SET "new_lessonId" = m.new_id FROM "_id_mapping_lesson" m WHERE "LessonProgress"."lessonId" = m.old_id;
UPDATE "LessonProgress" SET "new_userId" = m.new_id FROM "_id_mapping_user" m WHERE "LessonProgress"."userId" = m.old_id;
UPDATE "Vocabulary" SET "new_id" = m.new_id FROM "_id_mapping_vocabulary" m WHERE "Vocabulary".id = m.old_id;
UPDATE "UserVocabulary" SET "new_id" = m.new_id FROM "_id_mapping_user_vocabulary" m WHERE "UserVocabulary".id = m.old_id;
UPDATE "UserVocabulary" SET "new_userId" = m.new_id FROM "_id_mapping_user" m WHERE "UserVocabulary"."userId" = m.old_id;
UPDATE "UserVocabulary" SET "new_vocabularyId" = m.new_id FROM "_id_mapping_vocabulary" m WHERE "UserVocabulary"."vocabularyId" = m.old_id;
UPDATE "Conversation" SET "new_userId" = m.new_id FROM "_id_mapping_user" m WHERE "Conversation"."userId" = m.old_id;
UPDATE "Conversation" SET "new_templateId" = m.new_id FROM "_id_mapping_conversation_template" m WHERE "Conversation"."templateId" = m.old_id;
UPDATE "Message" SET "new_id" = m.new_id FROM "_id_mapping_message" m WHERE "Message".id = m.old_id;
UPDATE "ConversationTemplate" SET "new_id" = m.new_id FROM "_id_mapping_conversation_template" m WHERE "ConversationTemplate".id = m.old_id;
UPDATE "UserTemplateUsage" SET "new_id" = m.new_id FROM "_id_mapping_user_template_usage" m WHERE "UserTemplateUsage".id = m.old_id;
UPDATE "UserTemplateUsage" SET "new_userId" = m.new_id FROM "_id_mapping_user" m WHERE "UserTemplateUsage"."userId" = m.old_id;
UPDATE "UserTemplateUsage" SET "new_templateId" = m.new_id FROM "_id_mapping_conversation_template" m WHERE "UserTemplateUsage"."templateId" = m.old_id;
UPDATE "ExamResult" SET "new_id" = m.new_id FROM "_id_mapping_exam_result" m WHERE "ExamResult".id = m.old_id;
UPDATE "ExamResult" SET "new_userId" = m.new_id FROM "_id_mapping_user" m WHERE "ExamResult"."userId" = m.old_id;
UPDATE "PracticeSession" SET "new_userId" = m.new_id FROM "_id_mapping_user" m WHERE "PracticeSession"."userId" = m.old_id;
UPDATE "PracticeItem" SET "new_id" = m.new_id FROM "_id_mapping_practice_item" m WHERE "PracticeItem".id = m.old_id;
UPDATE "PracticeItem" SET "new_vocabularyId" = m.new_id FROM "_id_mapping_vocabulary" m WHERE "PracticeItem"."vocabularyId" = m.old_id;
UPDATE "PronunciationExercise" SET "new_id" = m.new_id FROM "_id_mapping_pronunciation_exercise" m WHERE "PronunciationExercise".id = m.old_id;
UPDATE "PronunciationPracticeItem" SET "new_id" = m.new_id FROM "_id_mapping_pronunciation_practice_item" m WHERE "PronunciationPracticeItem".id = m.old_id;
UPDATE "PronunciationPracticeItem" SET "new_exerciseId" = m.new_id FROM "_id_mapping_pronunciation_exercise" m WHERE "PronunciationPracticeItem"."exerciseId" = m.old_id;
UPDATE "GrammarRule" SET "new_id" = m.new_id FROM "_id_mapping_grammar_rule" m WHERE "GrammarRule".id = m.old_id;

-- Phase 5: Drop existing foreign key constraints
ALTER TABLE "LessonSection" DROP CONSTRAINT IF EXISTS "LessonSection_lessonId_fkey";
ALTER TABLE "LessonExercise" DROP CONSTRAINT IF EXISTS "LessonExercise_sectionId_fkey";
ALTER TABLE "LessonProgress" DROP CONSTRAINT IF EXISTS "LessonProgress_lessonId_fkey";
ALTER TABLE "LessonProgress" DROP CONSTRAINT IF EXISTS "LessonProgress_userId_fkey";
ALTER TABLE "UserVocabulary" DROP CONSTRAINT IF EXISTS "UserVocabulary_userId_fkey";
ALTER TABLE "UserVocabulary" DROP CONSTRAINT IF EXISTS "UserVocabulary_vocabularyId_fkey";
ALTER TABLE "Conversation" DROP CONSTRAINT IF EXISTS "Conversation_userId_fkey";
ALTER TABLE "Conversation" DROP CONSTRAINT IF EXISTS "Conversation_templateId_fkey";
ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS "Message_conversationId_fkey";
ALTER TABLE "UserTemplateUsage" DROP CONSTRAINT IF EXISTS "UserTemplateUsage_userId_fkey";
ALTER TABLE "UserTemplateUsage" DROP CONSTRAINT IF EXISTS "UserTemplateUsage_templateId_fkey";
ALTER TABLE "ExamResult" DROP CONSTRAINT IF EXISTS "ExamResult_userId_fkey";
ALTER TABLE "PracticeSession" DROP CONSTRAINT IF EXISTS "PracticeSession_userId_fkey";
ALTER TABLE "PracticeItem" DROP CONSTRAINT IF EXISTS "PracticeItem_sessionId_fkey";
ALTER TABLE "PracticeItem" DROP CONSTRAINT IF EXISTS "PracticeItem_vocabularyId_fkey";
ALTER TABLE "PronunciationPracticeItem" DROP CONSTRAINT IF EXISTS "PronunciationPracticeItem_sessionId_fkey";
ALTER TABLE "PronunciationPracticeItem" DROP CONSTRAINT IF EXISTS "PronunciationPracticeItem_exerciseId_fkey";

-- Phase 6: Drop existing primary key constraints and indexes
ALTER TABLE "User" DROP CONSTRAINT "User_pkey";
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_pkey";
ALTER TABLE "LessonSection" DROP CONSTRAINT "LessonSection_pkey";
ALTER TABLE "LessonExercise" DROP CONSTRAINT "LessonExercise_pkey";
ALTER TABLE "LessonProgress" DROP CONSTRAINT "LessonProgress_pkey";
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_pkey";
ALTER TABLE "UserVocabulary" DROP CONSTRAINT "UserVocabulary_pkey";
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey";
ALTER TABLE "ConversationTemplate" DROP CONSTRAINT "ConversationTemplate_pkey";
ALTER TABLE "UserTemplateUsage" DROP CONSTRAINT "UserTemplateUsage_pkey";
ALTER TABLE "ExamResult" DROP CONSTRAINT "ExamResult_pkey";
ALTER TABLE "PracticeItem" DROP CONSTRAINT "PracticeItem_pkey";
ALTER TABLE "PronunciationExercise" DROP CONSTRAINT "PronunciationExercise_pkey";
ALTER TABLE "PronunciationPracticeItem" DROP CONSTRAINT "PronunciationPracticeItem_pkey";
ALTER TABLE "GrammarRule" DROP CONSTRAINT "GrammarRule_pkey";

-- Drop unique constraints that reference old IDs
ALTER TABLE "LessonProgress" DROP CONSTRAINT IF EXISTS "LessonProgress_userId_lessonId_key";
ALTER TABLE "UserVocabulary" DROP CONSTRAINT IF EXISTS "UserVocabulary_userId_vocabularyId_key";

-- Phase 7: Drop old ID columns and rename new UUID columns
ALTER TABLE "User" DROP COLUMN "id";
ALTER TABLE "User" RENAME COLUMN "new_id" TO "id";

ALTER TABLE "Lesson" DROP COLUMN "id";
ALTER TABLE "Lesson" RENAME COLUMN "new_id" TO "id";

ALTER TABLE "LessonSection" DROP COLUMN "id", DROP COLUMN "lessonId";
ALTER TABLE "LessonSection" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "LessonSection" RENAME COLUMN "new_lessonId" TO "lessonId";

ALTER TABLE "LessonExercise" DROP COLUMN "id", DROP COLUMN "sectionId";
ALTER TABLE "LessonExercise" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "LessonExercise" RENAME COLUMN "new_sectionId" TO "sectionId";

ALTER TABLE "LessonProgress" DROP COLUMN "id", DROP COLUMN "lessonId", DROP COLUMN "userId";
ALTER TABLE "LessonProgress" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "LessonProgress" RENAME COLUMN "new_lessonId" TO "lessonId";
ALTER TABLE "LessonProgress" RENAME COLUMN "new_userId" TO "userId";

ALTER TABLE "Vocabulary" DROP COLUMN "id";
ALTER TABLE "Vocabulary" RENAME COLUMN "new_id" TO "id";

ALTER TABLE "UserVocabulary" DROP COLUMN "id", DROP COLUMN "userId", DROP COLUMN "vocabularyId";
ALTER TABLE "UserVocabulary" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "UserVocabulary" RENAME COLUMN "new_userId" TO "userId";
ALTER TABLE "UserVocabulary" RENAME COLUMN "new_vocabularyId" TO "vocabularyId";

ALTER TABLE "Conversation" DROP COLUMN "userId", DROP COLUMN "templateId";
ALTER TABLE "Conversation" RENAME COLUMN "new_userId" TO "userId";
ALTER TABLE "Conversation" RENAME COLUMN "new_templateId" TO "templateId";

ALTER TABLE "Message" DROP COLUMN "id";
ALTER TABLE "Message" RENAME COLUMN "new_id" TO "id";

ALTER TABLE "ConversationTemplate" DROP COLUMN "id";
ALTER TABLE "ConversationTemplate" RENAME COLUMN "new_id" TO "id";

ALTER TABLE "UserTemplateUsage" DROP COLUMN "id", DROP COLUMN "userId", DROP COLUMN "templateId";
ALTER TABLE "UserTemplateUsage" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "UserTemplateUsage" RENAME COLUMN "new_userId" TO "userId";
ALTER TABLE "UserTemplateUsage" RENAME COLUMN "new_templateId" TO "templateId";

ALTER TABLE "ExamResult" DROP COLUMN "id", DROP COLUMN "userId";
ALTER TABLE "ExamResult" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "ExamResult" RENAME COLUMN "new_userId" TO "userId";

ALTER TABLE "PracticeSession" DROP COLUMN "userId";
ALTER TABLE "PracticeSession" RENAME COLUMN "new_userId" TO "userId";

ALTER TABLE "PracticeItem" DROP COLUMN "id", DROP COLUMN "vocabularyId";
ALTER TABLE "PracticeItem" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "PracticeItem" RENAME COLUMN "new_vocabularyId" TO "vocabularyId";

ALTER TABLE "PronunciationExercise" DROP COLUMN "id";
ALTER TABLE "PronunciationExercise" RENAME COLUMN "new_id" TO "id";

ALTER TABLE "PronunciationPracticeItem" DROP COLUMN "id", DROP COLUMN "exerciseId";
ALTER TABLE "PronunciationPracticeItem" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "PronunciationPracticeItem" RENAME COLUMN "new_exerciseId" TO "exerciseId";

ALTER TABLE "GrammarRule" DROP COLUMN "id";
ALTER TABLE "GrammarRule" RENAME COLUMN "new_id" TO "id";

-- Phase 8: Add new primary key constraints
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id");
ALTER TABLE "LessonSection" ADD CONSTRAINT "LessonSection_pkey" PRIMARY KEY ("id");
ALTER TABLE "LessonExercise" ADD CONSTRAINT "LessonExercise_pkey" PRIMARY KEY ("id");
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id");
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("id");
ALTER TABLE "UserVocabulary" ADD CONSTRAINT "UserVocabulary_pkey" PRIMARY KEY ("id");
ALTER TABLE "Message" ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");
ALTER TABLE "ConversationTemplate" ADD CONSTRAINT "ConversationTemplate_pkey" PRIMARY KEY ("id");
ALTER TABLE "UserTemplateUsage" ADD CONSTRAINT "UserTemplateUsage_pkey" PRIMARY KEY ("id");
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id");
ALTER TABLE "PracticeItem" ADD CONSTRAINT "PracticeItem_pkey" PRIMARY KEY ("id");
ALTER TABLE "PronunciationExercise" ADD CONSTRAINT "PronunciationExercise_pkey" PRIMARY KEY ("id");
ALTER TABLE "PronunciationPracticeItem" ADD CONSTRAINT "PronunciationPracticeItem_pkey" PRIMARY KEY ("id");
ALTER TABLE "GrammarRule" ADD CONSTRAINT "GrammarRule_pkey" PRIMARY KEY ("id");

-- Phase 9: Add new foreign key constraints
ALTER TABLE "LessonSection" ADD CONSTRAINT "LessonSection_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LessonExercise" ADD CONSTRAINT "LessonExercise_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "LessonSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UserVocabulary" ADD CONSTRAINT "UserVocabulary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UserVocabulary" ADD CONSTRAINT "UserVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ConversationTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UserTemplateUsage" ADD CONSTRAINT "UserTemplateUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UserTemplateUsage" ADD CONSTRAINT "UserTemplateUsage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ConversationTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PracticeItem" ADD CONSTRAINT "PracticeItem_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PracticeSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PracticeItem" ADD CONSTRAINT "PracticeItem_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PronunciationPracticeItem" ADD CONSTRAINT "PronunciationPracticeItem_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PracticeSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PronunciationPracticeItem" ADD CONSTRAINT "PronunciationPracticeItem_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "PronunciationExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Phase 10: Recreate unique constraints with new UUID columns
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_lessonId_key" UNIQUE ("userId", "lessonId");
ALTER TABLE "UserVocabulary" ADD CONSTRAINT "UserVocabulary_userId_vocabularyId_key" UNIQUE ("userId", "vocabularyId");

-- Phase 11: Set NOT NULL constraints on new ID columns
ALTER TABLE "User" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "Lesson" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "LessonSection" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "LessonSection" ALTER COLUMN "lessonId" SET NOT NULL;
ALTER TABLE "LessonExercise" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "LessonExercise" ALTER COLUMN "sectionId" SET NOT NULL;
ALTER TABLE "LessonProgress" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "LessonProgress" ALTER COLUMN "lessonId" SET NOT NULL;
ALTER TABLE "LessonProgress" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Vocabulary" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "UserVocabulary" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "UserVocabulary" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "UserVocabulary" ALTER COLUMN "vocabularyId" SET NOT NULL;
ALTER TABLE "Conversation" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Message" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "ConversationTemplate" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "UserTemplateUsage" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "UserTemplateUsage" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "UserTemplateUsage" ALTER COLUMN "templateId" SET NOT NULL;
ALTER TABLE "ExamResult" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "ExamResult" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "PracticeSession" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "PracticeItem" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "PracticeItem" ALTER COLUMN "vocabularyId" SET NOT NULL;
ALTER TABLE "PronunciationExercise" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "PronunciationPracticeItem" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "PronunciationPracticeItem" ALTER COLUMN "exerciseId" SET NOT NULL;
ALTER TABLE "GrammarRule" ALTER COLUMN "id" SET NOT NULL;

-- Phase 12: Clean up mapping tables
DROP TABLE "_id_mapping_user";
DROP TABLE "_id_mapping_lesson";
DROP TABLE "_id_mapping_lesson_section";
DROP TABLE "_id_mapping_lesson_exercise";
DROP TABLE "_id_mapping_lesson_progress";
DROP TABLE "_id_mapping_vocabulary";
DROP TABLE "_id_mapping_user_vocabulary";
DROP TABLE "_id_mapping_message";
DROP TABLE "_id_mapping_conversation_template";
DROP TABLE "_id_mapping_user_template_usage";
DROP TABLE "_id_mapping_exam_result";
DROP TABLE "_id_mapping_practice_item";
DROP TABLE "_id_mapping_pronunciation_exercise";
DROP TABLE "_id_mapping_pronunciation_practice_item";
DROP TABLE "_id_mapping_grammar_rule";
