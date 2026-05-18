import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../_lib/getAuthenticatedUser";

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "10");
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
              ...(startDate ? { gte: `${startDate}T00:00:00.000Z` } : {}),
              ...(endDate ? { lte: `${endDate}T23:59:59.999Z` } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.moodLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.moodLog.count({ where }),
    ]);

    return NextResponse.json({ data, total, page }, { status: 200 });
  } catch (error) {
    console.error("GET_MOOD_LOGS_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
