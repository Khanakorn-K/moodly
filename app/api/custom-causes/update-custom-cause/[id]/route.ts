import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../../_lib/getAuthenticatedUser";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "MISSING_NAME" }, { status: 400 });
    }
    const nextName = String(name).trim();
    if (!nextName) {
      return NextResponse.json({ error: "MISSING_NAME" }, { status: 400 });
    }

    const existing = await prisma.customCause.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const relatedMoodLogs = await prisma.moodLog.findMany({
      where: {
        userId: user.id,
        causes: {
          has: existing.name,
        },
      },
    });

    const [updated] = await prisma.$transaction([
      prisma.customCause.update({
        where: { id },
        data: { name: nextName },
      }),
      ...relatedMoodLogs.map((moodLog) =>
        prisma.moodLog.update({
          where: { id: moodLog.id },
          data: {
            causes: moodLog.causes.map((cause) =>
              cause === existing.name ? nextName : cause,
            ),
          },
        }),
      ),
    ]);

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "ALREADY_EXISTS" }, { status: 400 });
    }
    console.error("UPDATE_CUSTOM_CAUSE_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
