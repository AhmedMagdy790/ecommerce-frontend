// types/api.ts

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}