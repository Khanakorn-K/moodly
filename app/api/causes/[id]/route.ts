import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
  const { id } = await params;
  const causeToDelete = await prisma.customCause.findUnique({
    where: { id: id },
  });

  if (!causeToDelete)
    return NextResponse.json({ error: "ไม่เจอข้อมูล" }, { status: 404 });

  await prisma.$transaction([
    prisma.moodLogCause.deleteMany({
      where: {
        cause: causeToDelete.name,
      },
    }),
    prisma.customCause.delete({
      where: { id: id },
    }),
  ]);

  return NextResponse.json({ message: "ลบเรียบร้อยทั้งระบบ" });
}
