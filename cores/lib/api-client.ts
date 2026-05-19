import type { apiResponseBase } from "../utils/apiResponseBase";

type RequestConfig = RequestInit & {
  params?: Record<string, string>;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

function isApiResponseBase<T>(payload: unknown): payload is apiResponseBase<T> {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "status" in payload &&
    "data" in payload &&
    "code" in payload
  );
}

function getErrorMessage(payload: unknown) {
  if (isApiResponseBase<{ error?: string; message?: string }>(payload)) {
    return payload.data.error || payload.data.message || "An error occurred";
  }

  if (typeof payload === "object" && payload !== null) {
    if ("error" in payload && typeof payload.error === "string") {
      return payload.error;
    }

    if ("message" in payload && typeof payload.message === "string") {
      return payload.message;
    }
  }

  return "An error occurred";
}

async function fetchWrapper<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<T> {
  const { params, ...init } = config;

  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(getErrorMessage(error));
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    fetchWrapper<T>(endpoint, { ...config, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    fetchWrapper<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    fetchWrapper<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
    fetchWrapper<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    fetchWrapper<T>(endpoint, { ...config, method: "DELETE" }),
};
