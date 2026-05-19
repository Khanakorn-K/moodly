import { prisma } from "@/prisma.config";
import { getAuthenticatedUser } from "../../_lib/getAuthenticatedUser";
import {
  createApiErrorResponse,
  createApiResponse,
} from "@/cores/utils/apiResponse";

export async function GET() {
  try {
    const { user, errorResponse } = await getAuthenticatedUser();
    if (errorResponse) return errorResponse;

    const causes = await prisma.customCause.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return createApiResponse(causes, { status: 200 });
  } catch (error) {
    console.error("GET_CUSTOM_CAUSES_ERROR:", error);
    return createApiErrorResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
