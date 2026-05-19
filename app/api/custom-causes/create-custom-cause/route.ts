import { NextRequest } from "next/server";
import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../_lib/getAuthenticatedUser";
import {
  createApiErrorResponse,
  createApiResponse,
} from "@/cores/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const { name, createdAt } = await req.json();
    if (!name) {
      return createApiErrorResponse("MISSING_NAME", { status: 400 });
    }

    const newCause = await prisma.customCause.create({
      data: { name, userId: user.id, createdAt },
    });

    return createApiResponse(newCause, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return createApiErrorResponse("ALREADY_EXISTS", { status: 400 });
    }
    console.error("CREATE_CUSTOM_CAUSE_ERROR:", error);
    return createApiErrorResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
