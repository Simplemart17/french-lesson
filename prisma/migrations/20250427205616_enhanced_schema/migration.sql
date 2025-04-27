/*
  Warnings:

  - You are about to drop the column `content` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `timeSpent` to the `ExamResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "templateId" INTEGER;

-- AlterTable
ALTER TABLE "ExamResult" ADD COLUMN     "timeSpent" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "content";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "corrections" JSONB,
ADD COLUMN     "suggestedVocabulary" JSONB;

-- AlterTable
ALTER TABLE "PracticeSession" ADD COLUMN     "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "score" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aiCorrectionEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "aiVocabSuggestionsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "preferredVoice" TEXT,
ADD COLUMN     "speechRecognitionEnabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UserVocabulary" ADD COLUMN     "nextReviewDate" TIMESTAMP(3),
ADD COLUMN     "repetitionStage" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Vocabulary" ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "pronunciation" TEXT,
ADD COLUMN     "usageContext" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "LessonSection" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "audioUrl" TEXT,
    "videoUrl" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "LessonSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonExercise" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,

    CONSTRAINT "LessonExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationTemplate" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "initialMessage" TEXT NOT NULL,
    "topics" TEXT[],
    "level" TEXT NOT NULL,

    CONSTRAINT "ConversationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTemplateUsage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTemplateUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PronunciationExercise" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "translation" TEXT,
    "audioUrl" TEXT,
    "difficulty" TEXT NOT NULL,
    "category" TEXT,
    "expectedPronunciation" TEXT,

    CONSTRAINT "PronunciationExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PronunciationPracticeItem" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "userAudioUrl" TEXT,
    "transcript" TEXT,
    "similarityScore" DOUBLE PRECISION,
    "feedback" JSONB,

    CONSTRAINT "PronunciationPracticeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrammarRule" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "examples" TEXT[],
    "level" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "GrammarRule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LessonSection" ADD CONSTRAINT "LessonSection_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonExercise" ADD CONSTRAINT "LessonExercise_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "LessonSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ConversationTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTemplateUsage" ADD CONSTRAINT "UserTemplateUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTemplateUsage" ADD CONSTRAINT "UserTemplateUsage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ConversationTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PronunciationPracticeItem" ADD CONSTRAINT "PronunciationPracticeItem_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PracticeSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PronunciationPracticeItem" ADD CONSTRAINT "PronunciationPracticeItem_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "PronunciationExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
