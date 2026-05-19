export interface apiResponseBase<T> {
  status: number;
  data: T;
  code: number;
}

export type ApiResponseBase<T> = apiResponseBase<T>;
