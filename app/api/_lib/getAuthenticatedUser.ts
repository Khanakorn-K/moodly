import { getServerSession } from "next-auth";
import { authOptions } from "@/cores/lib/auth";
import { prisma } from "@/prisma.config";
import { createApiErrorResponse } from "@/cores/utils/apiResponse";

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return {
      errorResponse: createApiErrorResponse("UNAUTHORIZED", { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return {
      errorResponse: createApiErrorResponse("USER_NOT_FOUND", { status: 404 }),
    };
  }

  return { user };
}
