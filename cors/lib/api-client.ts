type RequestConfig = RequestInit & {
  params?: Record<string, string>;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

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
    console.log("response error : ", error);
    throw new Error(error.message || response.statusText);
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
