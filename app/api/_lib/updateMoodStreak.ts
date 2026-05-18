import { prisma } from "@/prisma.config";

export async function updateMoodStreak(
  userId: string,
  currentLocalTime: string,
) {
  const today = new Date(currentLocalTime);
  today.setHours(0, 0, 0, 0);

  const streak = await prisma.streak.findUnique({ where: { userId } });
  if (!streak) {
    await prisma.streak.create({
      data: { userId, currentStreak: 1, longestStreak: 1, lastLogDate: today },
    });
    return;
  }

  const lastLog = streak.lastLogDate ? new Date(streak.lastLogDate) : null;
  if (lastLog) lastLog.setHours(0, 0, 0, 0);
  if (lastLog?.getTime() === today.getTime()) return;

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = lastLog?.getTime() === yesterday.getTime();

  const newStreak = isYesterday ? streak.currentStreak + 1 : 1;
  await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastLogDate: today,
    },
  });
}
