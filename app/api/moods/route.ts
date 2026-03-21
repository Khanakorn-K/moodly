import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma.config";

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
    const moodParam = searchParams.get("mood");
    const moodValue = moodParam ? parseInt(moodParam) : undefined;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    const allUserLogs = await prisma.moodLog.findMany({
      where: { userId: user.id },
      include: { causes: true },
    });

    const emptyLogIds = allUserLogs
      .filter((log) => log.causes.length === 0)
      .map((log) => log.id);

    if (emptyLogIds.length > 0) {
      await prisma.moodLog.deleteMany({
        where: { id: { in: emptyLogIds } },
      });
    }

    const where = {
      userId: user.id,
      ...(moodValue ? { mood: moodValue } : {}),
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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json();
    const { mood, causes, note } = body;
    const moodInt = parseInt(mood);

    if (isNaN(moodInt) || moodInt < 1 || moodInt > 5) {
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
        mood: moodInt,
        note: note ?? null,
        causes: {
          create: (causes ?? []).map((cause: string) => ({ cause })),
        },
      },
      include: { causes: true },
    });

    await updateStreak(user.id);
    return NextResponse.json(moodLog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}

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

  if (lastLog?.getTime() === today.getTime()) return;

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
}
