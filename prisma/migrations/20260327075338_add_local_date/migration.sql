/*
  Warnings:

  - You are about to drop the column `date` on the `MoodLog` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "MoodLog_userId_date_idx";

-- DropIndex
DROP INDEX "MoodLog_userId_date_key";

-- AlterTable
ALTER TABLE "CustomCause" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "MoodLog" DROP COLUMN "date",
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TEXT;
