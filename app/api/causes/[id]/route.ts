// ไฟล์จัดการ Custom Causes (PATCH, DELETE)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/cors/lib/auth";
import { prisma } from "@/prisma.config";

export async function PATCH(
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

    const { name } = await req.json();
    if (!name)
      return NextResponse.json({ error: "MISSING_NAME" }, { status: 400 });

    const existing = await prisma.customCause.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    const updated = await prisma.customCause.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "ALREADY_EXISTS" }, { status: 400 });
    }
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

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    const causeToDelete = await prisma.customCause.findUnique({
      where: { id },
    });

    if (!causeToDelete || causeToDelete.userId !== user.id) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.moodLog.deleteMany({
        //user และ causes ต้องใช้สองเงื่อนไขไม่งั้นถ้า user สองคนตั้ง causes ชื่อเหมือนกันเด๊ะ จะโดนลบทั้งสองเลบต้องส่ง userid เจ้าของที่จะลบมาเพื่อหาด้วย
        where: {
          userId: user.id,
          causes: {
            has: causeToDelete.name,
          },
        },
      }),
      prisma.customCause.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json(
      { message: "ลบสาเหตุและประวัติที่เกี่ยวข้องเรียบร้อย" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE_CAUSE_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
