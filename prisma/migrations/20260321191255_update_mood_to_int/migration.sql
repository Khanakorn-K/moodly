/*
  Warnings:

  - Changed the type of `mood` on the `MoodLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cause` on the `MoodLogCause` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MoodLog" DROP COLUMN "mood",
ADD COLUMN     "mood" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MoodLogCause" DROP COLUMN "cause",
ADD COLUMN     "cause" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Cause";

-- CreateTable
CREATE TABLE "CustomCause" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomCause_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomCause_userId_idx" ON "CustomCause"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomCause_userId_name_key" ON "CustomCause"("userId", "name");

-- AddForeignKey
ALTER TABLE "CustomCause" ADD CONSTRAINT "CustomCause_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
