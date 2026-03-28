/*
  Warnings:

  - You are about to drop the `MoodLogCause` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MoodLogCause" DROP CONSTRAINT "MoodLogCause_moodLogId_fkey";

-- DropIndex
DROP INDEX "MoodLog_userId_idx";

-- AlterTable
ALTER TABLE "MoodLog" ADD COLUMN     "causes" TEXT[];

-- DropTable
DROP TABLE "MoodLogCause";
