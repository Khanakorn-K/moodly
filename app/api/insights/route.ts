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

    // ใช้ any เพื่อ bypass ขีดแดงกรณีที่ DB เป็น String แต่เราจะกรองช่วงเวลาครับ
    let dateFilter: any = {};

    if (startDateParam) {
      const targetDate = new Date(startDateParam);

      // แปลงเป็น ISO String เพื่อให้เปรียบเทียบกับ String ใน DB ได้ครับมาสเตอร์
      const startISO = new Date(
        new Date(targetDate).setHours(0, 0, 0, 0),
      ).toISOString();
      const endISO = new Date(
        new Date(targetDate).setHours(23, 59, 59, 999),
      ).toISOString();

      dateFilter = {
        date: {
          gte: startISO,
          lte: endISO,
        },
      };
    }

    const logs = await prisma.moodLog.findMany({
      where: {
        userId: user.id,
        ...dateFilter,
        // เพิ่มเงื่อนไขให้แน่ใจว่ามี causes เพื่อไม่ให้ data เพี้ยนครับ
        causes: { some: {} },
      },
      include: { causes: true },
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
      log.causes.forEach((causeRecord) => {
        const cause = causeRecord.cause;
        const moodKey = String(log.mood);

        if (!causesAnalysis[cause]) {
          causesAnalysis[cause] = {};
        }

        causesAnalysis[cause][moodKey] =
          (causesAnalysis[cause][moodKey] || 0) + 1;
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
    console.error("INSIGHTS_GET_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
