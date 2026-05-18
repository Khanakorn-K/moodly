import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../_lib/getAuthenticatedUser";

export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const { name, createdAt } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "MISSING_NAME" }, { status: 400 });
    }

    const newCause = await prisma.customCause.create({
      data: { name, userId: user.id, createdAt },
    });

    return NextResponse.json(newCause, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "ALREADY_EXISTS" }, { status: 400 });
    }
    console.error("CREATE_CUSTOM_CAUSE_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
