import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/cors/lib/auth";
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

    const selectedDate = req.nextUrl.searchParams.get("selectedDate");

    let dateFilter: any = {};

    if (selectedDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(selectedDate)) {
        return NextResponse.json(
          { error: "INVALID_DATE_FORMAT" },
          { status: 400 },
        );
      }

      dateFilter = {
        createdAt: {
          startsWith: selectedDate,
        },
      };
    }

    const logs = await prisma.moodLog.findMany({
      where: {
        userId: user.id,
        ...dateFilter,
      },
    });

    const moodDistribution = logs.reduce(
      (acc, log) => {
        const moodKey = String(log.mood);
        acc[moodKey] = (acc[moodKey] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const causesAnalysis: Record<string, Record<string, number>> = {};

    logs.forEach((log) => {
      if (log.causes && Array.isArray(log.causes)) {
        log.causes.forEach((cause) => {
          if (!cause) return;

          const moodKey = String(log.mood);

          if (!causesAnalysis[cause]) {
            causesAnalysis[cause] = {};
          }

          causesAnalysis[cause][moodKey] =
            (causesAnalysis[cause][moodKey] || 0) + 1;
        });
      }
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
    console.error("INSIGHTS_GET_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
