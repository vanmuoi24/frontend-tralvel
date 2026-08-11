import axios from "axios";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? "API request failed";
    return Promise.reject(new Error(message));
  }
);
