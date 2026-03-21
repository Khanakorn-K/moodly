import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma.config";

export async function GET(req: NextRequest) {
  try {
    // 1. ตรวจสอบสิทธิ์ผู้ใช้
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

    // 2. รับ Date Range จาก Query Params (ถ้ามี)
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const dateFilter = {
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
        : {}),
    };

    // 3. ดึงข้อมูล MoodLog พร้อมกับสาเหตุ (Causes)
    const logs = await prisma.moodLog.findMany({
      where: {
        userId: user.id,
        ...dateFilter,
        causes: { some: {} },
      },

      include: { causes: true },
    });

    // 4. คำนวณสัดส่วนอารมณ์ (Mood Distribution)
    const moodDistribution = logs.reduce(
      (acc, log) => {
        acc[log.mood] = (acc[log.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // 5. คำนวณความเชื่อมโยงระหว่าง สาเหตุ (Cause) และ อารมณ์ (Mood)
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

    // 6. ส่งข้อมูลกลับไปให้ Frontend
    return NextResponse.json(
      {
        totalLogs: logs.length,
        moodDistribution,
        causesAnalysis,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[INSIGHTS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
