import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../_lib/getAuthenticatedUser";
import {
  convertYYMMDDToEndOfDayISO,
  convertYYMMDDToStartOfDayISO,
} from "@/cores/utils/thaiDate";

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");
    const moodValue = req.nextUrl.searchParams.get("mood")
      ? parseInt(req.nextUrl.searchParams.get("mood")!)
      : undefined;

    const where: any = {
      userId: user.id,
      ...(moodValue ? { mood: moodValue } : {}),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate
                ? { gte: convertYYMMDDToStartOfDayISO(startDate) }
                : {}),
              ...(endDate ? { lte: convertYYMMDDToEndOfDayISO(endDate) } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.moodLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.moodLog.count({ where }),
    ]);

    return NextResponse.json({ data, total }, { status: 200 });
  } catch (error) {
    console.error("GET_MOOD_LOGS_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
