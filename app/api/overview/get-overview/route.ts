import { NextRequest } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../_lib/getAuthenticatedUser";
import {
  convertYYMMDDToEndOfDayISO,
  convertYYMMDDToStartOfDayISO,
  createYYMMDDDateRange,
  isValidYYMMDDDate,
} from "@/cores/utils/thaiDate";
import {
  calculateAverageMood,
  calculateCauseSummaries,
  calculateDailyMoodAverages,
  calculateMoodDistribution,
  createMoodNotes,
} from "@/app/shared/moodAnalytics";
import {
  createApiErrorResponse,
  createApiResponse,
} from "@/cores/utils/apiResponse";

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");

    if (!startDate || !endDate) {
      return createApiErrorResponse("DATE_RANGE_REQUIRED", { status: 400 });
    }

    if (!isValidYYMMDDDate(startDate) || !isValidYYMMDDDate(endDate)) {
      return createApiErrorResponse("INVALID_DATE_FORMAT", { status: 400 });
    }

    if (startDate > endDate) {
      return createApiErrorResponse("INVALID_DATE_RANGE", { status: 400 });
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

    const totalLogs = logs.length;
    const averageMood = calculateAverageMood(logs);
    const dailyMoodAverages = calculateDailyMoodAverages(
      logs,
      createYYMMDDDateRange(startDate, endDate),
    );
    const moodDistribution = calculateMoodDistribution(logs);
    const moodNotes = createMoodNotes(logs);
    const causeSummaries = calculateCauseSummaries(logs);

    return createApiResponse(
      {
        startDate,
        endDate,
        totalLogs,
        averageMood,
        dailyMoodAverages,
        moodDistribution,
        moodNotes,
        causeSummaries,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET_OVERVIEW_ERROR:", error);
    return createApiErrorResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
