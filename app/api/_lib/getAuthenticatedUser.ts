import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/cors/lib/auth";
import { prisma } from "@/prisma.config";

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return {
      errorResponse: NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 },
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: "USER_NOT_FOUND" },
        { status: 404 },
      ),
    };
  }

  return { user };
}
