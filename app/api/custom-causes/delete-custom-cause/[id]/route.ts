import { NextResponse } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../../_lib/getAuthenticatedUser";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const causeToDelete = await prisma.customCause.findUnique({
      where: { id },
    });

    if (!causeToDelete || causeToDelete.userId !== user.id) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.moodLog.deleteMany({
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
    console.error("DELETE_CUSTOM_CAUSE_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
