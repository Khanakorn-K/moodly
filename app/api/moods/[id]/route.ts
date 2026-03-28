// ไฟล์จัดการ Mood Logs (GET, PUT, DELETE)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/cors/lib/auth";
import { prisma } from "@/prisma.config";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });

    const moodLog = await prisma.moodLog.findUnique({
      where: { id },
      // เอา include causes ออกไปได้เลย
    });

    if (!moodLog || moodLog.userId !== user.id) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json(moodLog, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });

    const existing = await prisma.moodLog.findUnique({
      where: { id },
    });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const body = await req.json();
    const { mood, causes, note } = body;

    const updated = await prisma.moodLog.update({
      where: { id },
      data: {
        mood: mood,
        note: note,
        causes: causes || [], // โยน Array เช่น ["WORK", "HEALTH"] เข้าไปตรงๆ ได้เลย
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });

    const existing = await prisma.moodLog.findUnique({
      where: { id },
    });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    await prisma.moodLog.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
