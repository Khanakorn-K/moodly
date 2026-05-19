import { NextRequest } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../_lib/getAuthenticatedUser";
import { updateMoodStreak } from "../../_lib/updateMoodStreak";
import {
  createApiErrorResponse,
  createApiResponse,
} from "@/cores/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const { mood, causes, note, createdAt } = await req.json();

    const moodLog = await prisma.moodLog.create({
      data: {
        userId: user.id,
        mood: parseInt(mood),
        note: note ?? null,
        createdAt,
        causes: causes || [],
      },
    });

    await updateMoodStreak(user.id, createdAt);
    return createApiResponse(moodLog, { status: 201 });
  } catch (error) {
    console.error("CREATE_MOOD_LOG_ERROR:", error);
    return createApiErrorResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
