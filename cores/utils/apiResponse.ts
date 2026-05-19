import { NextResponse } from "next/server";
import type { apiResponseBase } from "./apiResponseBase";

type ApiResponseOptions = {
  status?: number;
  code?: number;
};

export function createApiResponse<T>(
  data: T,
  options: ApiResponseOptions = {},
) {
  const status = options.status ?? 200;

  return NextResponse.json<apiResponseBase<T>>(
    {
      status,
      data,
      code: options.code ?? status,
    },
    { status },
  );
}

export function createApiErrorResponse(
  error: string,
  options: ApiResponseOptions = {},
) {
  return createApiResponse(
    { error },
    {
      status: options.status ?? 500,
      code: options.code,
    },
  );
}
