import { NextRequest } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../../_lib/getAuthenticatedUser";
import {
  createApiErrorResponse,
  createApiResponse,
} from "@/cores/utils/apiResponse";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const { name } = await req.json();
    if (!name) {
      return createApiErrorResponse("MISSING_NAME", { status: 400 });
    }
    const nextName = String(name).trim();
    if (!nextName) {
      return createApiErrorResponse("MISSING_NAME", { status: 400 });
    }

    const existing = await prisma.customCause.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return createApiErrorResponse("NOT_FOUND", { status: 404 });
    }

    const relatedMoodLogs = await prisma.moodLog.findMany({
      where: {
        userId: user.id,
        causes: {
          has: existing.name,
        },
      },
    });

    const [updated] = await prisma.$transaction([
      prisma.customCause.update({
        where: { id },
        data: { name: nextName },
      }),
      ...relatedMoodLogs.map((moodLog: any) =>
        prisma.moodLog.update({
          where: { id: moodLog.id },
          data: {
            causes: moodLog.causes.map((cause: any) =>
              cause === existing.name ? nextName : cause,
            ),
          },
        }),
      ),
    ]);

    return createApiResponse(updated, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return createApiErrorResponse("ALREADY_EXISTS", { status: 400 });
    }
    console.error("UPDATE_CUSTOM_CAUSE_ERROR:", error);
    return createApiErrorResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
