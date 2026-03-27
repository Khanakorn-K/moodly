import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma.config";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const moodValue = searchParams.get("mood")
      ? parseInt(searchParams.get("mood")!)
      : undefined;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });

    const where: any = {
      userId: user.id,
      causes: { some: {} },
      ...(moodValue ? { mood: moodValue } : {}),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate
                ? {
                    gte: new Date(
                      new Date(startDate).setHours(0, 0, 0, 0),
                    ).toISOString(),
                  }
                : {}),
              ...(endDate
                ? {
                    lte: new Date(
                      new Date(endDate).setHours(23, 59, 59, 999),
                    ).toISOString(),
                  }
                : {}),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.moodLog.findMany({
        where,
        include: { causes: true },
        orderBy: { createdAt: "desc" },
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
    if (!session?.user?.email)
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const { mood, causes, note, createdAt } = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });

    const moodLog = await prisma.moodLog.create({
      data: {
        userId: user.id,
        mood: parseInt(mood),
        note: note ?? null,
        createdAt: createdAt, // ใช้ค่าที่ส่งมาจาก getThailandTime() ของมาสเตอร์
        causes: { create: (causes ?? []).map((cause: string) => ({ cause })) },
      },
      include: { causes: true },
    });

    await updateStreak(user.id, createdAt);
    return NextResponse.json(moodLog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}

async function updateStreak(userId: string, currentLocalTime: string) {
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
