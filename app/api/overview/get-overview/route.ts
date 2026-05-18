import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../_lib/getAuthenticatedUser";
import { standartMoods } from "@/app/shared/moodType";
import {
  convertYYMMDDToEndOfDayISO,
  convertYYMMDDToStartOfDayISO,
  createYYMMDDDateRange,
  isValidYYMMDDDate,
} from "@/cores/utils/thaiDate";

const moodValues = standartMoods.map((mood) => mood.value);

function roundOneDecimal(value: number) {
  return Number(value.toFixed(1));
}

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "DATE_RANGE_REQUIRED" },
        { status: 400 },
      );
    }

    if (!isValidYYMMDDDate(startDate) || !isValidYYMMDDDate(endDate)) {
      return NextResponse.json(
        { error: "INVALID_DATE_FORMAT" },
        { status: 400 },
      );
    }

    if (startDate > endDate) {
      return NextResponse.json(
        { error: "INVALID_DATE_RANGE" },
        { status: 400 },
      );
    }

    const logs = await prisma.moodLog.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: convertYYMMDDToStartOfDayISO(startDate),
          lte: convertYYMMDDToEndOfDayISO(endDate),
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const dailyMoodMap: Record<string, { totalMood: number; totalLogs: number }> =
      {};
    const moodDistributionMap: Record<number, number> = {};
    const causeSummaryMap: Record<
      string,
      { totalCount: number; moodBreakdown: Record<number, number> }
    > = {};

    moodValues.forEach((mood) => {
      moodDistributionMap[mood] = 0;
    });

    logs.forEach((log) => {
      const date = log.createdAt.split("T")[0];
      const mood = Number(log.mood);

      if (!dailyMoodMap[date]) {
        dailyMoodMap[date] = { totalMood: 0, totalLogs: 0 };
      }

      dailyMoodMap[date].totalMood += mood;
      dailyMoodMap[date].totalLogs += 1;
      moodDistributionMap[mood] = (moodDistributionMap[mood] ?? 0) + 1;

      log.causes.forEach((cause) => {
        if (!cause) return;

        if (!causeSummaryMap[cause]) {
          causeSummaryMap[cause] = {
            totalCount: 0,
            moodBreakdown: {},
          };
        }

        causeSummaryMap[cause].totalCount += 1;
        causeSummaryMap[cause].moodBreakdown[mood] =
          (causeSummaryMap[cause].moodBreakdown[mood] ?? 0) + 1;
      });
    });

    const totalLogs = logs.length;
    const totalMood = logs.reduce((sum, log) => sum + Number(log.mood), 0);
    const averageMood = totalLogs ? roundOneDecimal(totalMood / totalLogs) : 0;

    const dailyMoodAverages = createYYMMDDDateRange(startDate, endDate).map(
      (date) => {
        const value = dailyMoodMap[date];

        if (!value) {
          return {
            date,
            averageMood: 0,
            totalLogs: 0,
          };
        }

        return {
          date,
          averageMood: roundOneDecimal(value.totalMood / value.totalLogs),
          totalLogs: value.totalLogs,
        };
      },
    );

    const moodDistribution = moodValues.map((mood) => ({
      mood,
      count: moodDistributionMap[mood] ?? 0,
    }));

    const causeSummaries = Object.entries(causeSummaryMap)
      .map(([cause, value]) => ({
        cause,
        totalCount: value.totalCount,
        moodBreakdown: moodValues.map((mood) => ({
          mood,
          count: value.moodBreakdown[mood] ?? 0,
        })),
      }))
      .sort((firstCause, secondCause) => {
        return secondCause.totalCount - firstCause.totalCount;
      });

    return NextResponse.json(
      {
        startDate,
        endDate,
        totalLogs,
        averageMood,
        dailyMoodAverages,
        moodDistribution,
        causeSummaries,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET_OVERVIEW_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
