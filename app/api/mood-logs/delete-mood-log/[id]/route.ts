import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../../_lib/getAuthenticatedUser";
import {
  createApiErrorResponse,
  createApiResponse,
} from "@/cores/utils/apiResponse";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const existing = await prisma.moodLog.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return createApiErrorResponse("NOT_FOUND", { status: 404 });
    }

    await prisma.moodLog.delete({ where: { id } });

    return createApiResponse({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE_MOOD_LOG_ERROR:", error);
    return createApiErrorResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
