import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma.config";

// GET /api/insights?period=week|month
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") ?? "week";

  const now = new Date();
  const startDate = new Date(now);
  if (period === "week") {
    startDate.setDate(now.getDate() - 7);
  } else {
    startDate.setMonth(now.getMonth() - 1);
  }

  const logs = await prisma.moodLog.findMany({
    where: { userId: user.id, date: { gte: startDate } },
    include: { causes: true },
    orderBy: { date: "asc" },
  });

  if (logs.length === 0) {
    return NextResponse.json({
      averageMood: 0,
      totalLogs: 0,
      topCauses: [],
      moodByDay: [],
      moodTrend: "neutral",
    });
  }

  // Average mood
  const averageMood =
    Math.round((logs.reduce((sum, l) => sum + l.mood, 0) / logs.length) * 10) /
    10;

  // Mood by day
  const moodByDay = logs.map((l) => ({
    date: l.date.toISOString().split("T")[0],
    mood: l.mood,
  }));

  // Top causes
  const causeCount: Record<string, number> = {};
  logs.forEach((l) =>
    l.causes.forEach((c) => {
      causeCount[c.cause] = (causeCount[c.cause] ?? 0) + 1;
    }),
  );
  const totalCauses = Object.values(causeCount).reduce((a, b) => a + b, 0);
  const topCauses = Object.entries(causeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cause, count]) => ({
      cause,
      count,
      percentage: Math.round((count / totalCauses) * 100),
    }));

  // Trend
  const half = Math.floor(logs.length / 2);
  const firstAvg =
    logs.slice(0, half).reduce((s, l) => s + l.mood, 0) / (half || 1);
  const secondAvg =
    logs.slice(half).reduce((s, l) => s + l.mood, 0) /
    (logs.length - half || 1);
  const moodTrend =
    secondAvg > firstAvg
      ? "improving"
      : secondAvg < firstAvg
        ? "declining"
        : "neutral";

  return NextResponse.json({
    averageMood,
    totalLogs: logs.length,
    topCauses,
    moodByDay,
    moodTrend,
  });
}
