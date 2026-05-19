import { NextRequest } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../_lib/getAuthenticatedUser";
import { isValidYYMMDDDate } from "@/cores/utils/thaiDate";
import {
  createApiErrorResponse,
  createApiResponse,
} from "@/cores/utils/apiResponse";
import {
  calculateAverageMood,
  calculateCauseAnalysis,
  calculateMoodDistributionRecord,
} from "@/app/shared/moodAnalytics";

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const selectedDate = req.nextUrl.searchParams.get("selectedDate");
    let dateFilter: { createdAt?: { startsWith: string } } = {};

    if (selectedDate) {
      if (!isValidYYMMDDDate(selectedDate)) {
        return createApiErrorResponse("INVALID_DATE_FORMAT", { status: 400 });
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

    const totalLogs = logs.length;
    const averageMood = calculateAverageMood(logs);
    const moodDistribution = calculateMoodDistributionRecord(logs);
    const causesAnalysis = calculateCauseAnalysis(logs);

    return createApiResponse(
      {
        totalLogs,
        averageMood,
        moodDistribution,
        causesAnalysis,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET_INSIGHTS_ERROR:", error);
    return createApiErrorResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
