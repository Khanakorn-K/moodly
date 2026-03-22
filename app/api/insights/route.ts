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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");

    let dateFilter = {};

    if (startDateParam) {
      const targetDate = new Date(startDateParam);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      dateFilter = {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      };
    }

    const logs = await prisma.moodLog.findMany({
      where: {
        userId: user.id,
        ...dateFilter,
        causes: { some: {} },
      },
      include: { causes: true },
    });

    const moodDistribution = logs.reduce(
      (acc, log) => {
        acc[log.mood] = (acc[log.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const causesAnalysis: Record<string, Record<string, number>> = {};

    logs.forEach((log) => {
      log.causes.forEach((causeRecord) => {
        const cause = causeRecord.cause;
        const mood = log.mood;

        if (!causesAnalysis[cause]) {
          causesAnalysis[cause] = {};
        }

        causesAnalysis[cause][mood] = (causesAnalysis[cause][mood] || 0) + 1;
      });
    });

    return NextResponse.json(
      {
        totalLogs: logs.length,
        moodDistribution,
        causesAnalysis,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
