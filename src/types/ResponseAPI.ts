export type AxiosResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
  error?: unknown;
  timestamp?: string;
};
