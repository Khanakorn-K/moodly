import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../_lib/getAuthenticatedUser";
import { isValidYYMMDDDate } from "@/cores/utils/thaiDate";

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const selectedDate = req.nextUrl.searchParams.get("selectedDate");
    let dateFilter: any = {};

    if (selectedDate) {
      if (!isValidYYMMDDDate(selectedDate)) {
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
    console.error("GET_INSIGHTS_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
