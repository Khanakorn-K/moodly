import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/cors/lib/auth";
import { prisma } from "@/prisma.config";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const causes = await prisma.customCause.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(causes);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });

    const { name, createdAt } = await req.json();
    if (!name)
      return NextResponse.json({ error: "MISSING_NAME" }, { status: 400 });

    const newCause = await prisma.customCause.create({
      data: { name, userId: user.id, createdAt: createdAt },
    });

    return NextResponse.json(newCause, { status: 201 });
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
