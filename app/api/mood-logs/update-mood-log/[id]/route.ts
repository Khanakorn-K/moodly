import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../../_lib/getAuthenticatedUser";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const existing = await prisma.moodLog.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const { mood, causes, note } = await req.json();
    const updated = await prisma.moodLog.update({
      where: { id },
      data: {
        mood,
        note,
        causes: causes || [],
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("UPDATE_MOOD_LOG_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
