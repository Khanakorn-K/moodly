import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma.config";

// GET /api/moods
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const mood = searchParams.get("mood");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    const where = {
      userId: user.id,
      ...(mood ? { mood: mood } : {}),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate
                ? { gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)) }
                : {}),
              ...(endDate
                ? { lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) }
                : {}),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.moodLog.findMany({
        where,
        include: { causes: true },
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.moodLog.count({ where }),
    ]);

    return NextResponse.json({ data, total, page }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
// POST /api/moods
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const { mood, causes, note } = body;

    if (!mood || mood < 1 || mood > 5) {
      return NextResponse.json({ error: "INVALID_MOOD" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    const moodLog = await prisma.moodLog.create({
      data: {
        userId: user.id,
        mood,
        note: note ?? null,
        causes: {
          create: (causes ?? []).map((cause: string) => ({ cause })),
        },
      },
      include: { causes: true },
    });

    // Update streak
    await updateStreak(user.id);

    return NextResponse.json(moodLog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}

// Helper: update streak after logging mood
async function updateStreak(userId: string) {
  const streak = await prisma.streak.findUnique({ where: { userId } });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!streak) {
    await prisma.streak.create({
      data: { userId, currentStreak: 1, longestStreak: 1, lastLogDate: today },
    });
    return;
  }

  const lastLog = streak.lastLogDate ? new Date(streak.lastLogDate) : null;
  if (lastLog) lastLog.setHours(0, 0, 0, 0);

  const isToday = lastLog?.getTime() === today.getTime();
  if (isToday) return; // already logged today

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = lastLog?.getTime() === yesterday.getTime();

  const newStreak = isYesterday ? streak.currentStreak + 1 : 1;
  const newLongest = Math.max(newStreak, streak.longestStreak);

  await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastLogDate: today,
    },
  });

  // Unlock achievements
  const milestones = [
    { streak: 1, label: "เริ่มต้น", icon: "🌱" },
    { streak: 7, label: "7 วัน", icon: "🔥" },
    { streak: 10, label: "10 วัน", icon: "⭐" },
    { streak: 30, label: "30 วัน", icon: "👑" },
  ];

  for (const m of milestones) {
    if (newStreak >= m.streak) {
      const existing = await prisma.achievement.findFirst({
        where: { streak: { userId }, label: m.label },
      });
      if (!existing) {
        await prisma.achievement.create({
          data: { streakId: streak.id, label: m.label, icon: m.icon },
        });
      }
    }
  }
}
