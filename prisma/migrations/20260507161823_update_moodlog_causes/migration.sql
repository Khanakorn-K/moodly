/*
  Warnings:

  - The `causes` column on the `MoodLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MoodLog" DROP COLUMN "causes",
ADD COLUMN     "causes" TEXT[];
