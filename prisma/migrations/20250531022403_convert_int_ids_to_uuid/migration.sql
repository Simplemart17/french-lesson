/*
  Warnings:

  - The primary key for the `ConversationTemplate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ExamResult` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `GrammarRule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Lesson` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LessonExercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LessonProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LessonSection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PracticeItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PronunciationExercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PronunciationPracticeItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserTemplateUsage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserVocabulary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Vocabulary` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExamResult" DROP CONSTRAINT "ExamResult_userId_fkey";

-- DropForeignKey
ALTER TABLE "LessonExercise" DROP CONSTRAINT "LessonExercise_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "LessonProgress" DROP CONSTRAINT "LessonProgress_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "LessonProgress" DROP CONSTRAINT "LessonProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "LessonSection" DROP CONSTRAINT "LessonSection_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "PracticeItem" DROP CONSTRAINT "PracticeItem_vocabularyId_fkey";

-- DropForeignKey
ALTER TABLE "PracticeSession" DROP CONSTRAINT "PracticeSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "PronunciationPracticeItem" DROP CONSTRAINT "PronunciationPracticeItem_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "UserTemplateUsage" DROP CONSTRAINT "UserTemplateUsage_templateId_fkey";

-- DropForeignKey
ALTER TABLE "UserTemplateUsage" DROP CONSTRAINT "UserTemplateUsage_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserVocabulary" DROP CONSTRAINT "UserVocabulary_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserVocabulary" DROP CONSTRAINT "UserVocabulary_vocabularyId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "templateId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ConversationTemplate" DROP CONSTRAINT "ConversationTemplate_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ConversationTemplate_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ExamResult" DROP CONSTRAINT "ExamResult_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GrammarRule" DROP CONSTRAINT "GrammarRule_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "GrammarRule_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LessonExercise" DROP CONSTRAINT "LessonExercise_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "sectionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "LessonExercise_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LessonProgress" DROP CONSTRAINT "LessonProgress_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "lessonId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LessonSection" DROP CONSTRAINT "LessonSection_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "lessonId" SET DATA TYPE TEXT,
ADD CONSTRAINT "LessonSection_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PracticeItem" DROP CONSTRAINT "PracticeItem_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "vocabularyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PracticeItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PracticeSession" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PronunciationExercise" DROP CONSTRAINT "PronunciationExercise_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PronunciationExercise_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PronunciationPracticeItem" DROP CONSTRAINT "PronunciationPracticeItem_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "exerciseId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PronunciationPracticeItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserTemplateUsage" DROP CONSTRAINT "UserTemplateUsage_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "templateId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserTemplateUsage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserVocabulary" DROP CONSTRAINT "UserVocabulary_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "vocabularyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserVocabulary_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "LessonSection" ADD CONSTRAINT "LessonSection_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonExercise" ADD CONSTRAINT "LessonExercise_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "LessonSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVocabulary" ADD CONSTRAINT "UserVocabulary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVocabulary" ADD CONSTRAINT "UserVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ConversationTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTemplateUsage" ADD CONSTRAINT "UserTemplateUsage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ConversationTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTemplateUsage" ADD CONSTRAINT "UserTemplateUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeItem" ADD CONSTRAINT "PracticeItem_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PronunciationPracticeItem" ADD CONSTRAINT "PronunciationPracticeItem_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "PronunciationExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
