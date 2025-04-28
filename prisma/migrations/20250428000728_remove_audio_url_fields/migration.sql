/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `PronunciationExercise` table. All the data in the column will be lost.
  - You are about to drop the column `audioUrl` on the `Vocabulary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PronunciationExercise" DROP COLUMN "audioUrl";

-- AlterTable
ALTER TABLE "Vocabulary" DROP COLUMN "audioUrl";
