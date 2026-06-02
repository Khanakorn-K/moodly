import { NextRequest } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../_lib/getAuthenticatedUser";
import {
  convertYYMMDDToEndOfDayISO,
  convertYYMMDDToStartOfDayISO,
  createYYMMMonthDateRange,
  createYYMMDDDateRange,
  isValidYYMMMonth,
} from "@/cores/utils/thaiDate";
import {
  calculateAverageMood,
  calculateDailyMoodAverages,
} from "@/app/shared/moodAnalytics";
import {
  createApiErrorResponse,
  createApiResponse,
} from "@/cores/utils/apiResponse";

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const month = req.nextUrl.searchParams.get("month");

    if (!month) {
      return createApiErrorResponse("MONTH_REQUIRED", { status: 400 });
    }

    if (!isValidYYMMMonth(month)) {
      return createApiErrorResponse("INVALID_MONTH_FORMAT", { status: 400 });
    }

    const { startDate, endDate } = createYYMMMonthDateRange(month);

    const logs = await prisma.moodLog.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: convertYYMMDDToStartOfDayISO(startDate),
          lte: convertYYMMDDToEndOfDayISO(endDate),
        },
      },
      select: {
        mood: true,
        causes: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const dateRange = createYYMMDDDateRange(startDate, endDate);
    const dailyMoodAverages = calculateDailyMoodAverages(logs, dateRange);

    return createApiResponse(
      {
        month,
        startDate,
        endDate,
        totalLogs: logs.length,
        averageMood: calculateAverageMood(logs),
        dailyMoodAverages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET_MONTHLY_AVERAGE_MOOD_ERROR:", error);
    return createApiErrorResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
