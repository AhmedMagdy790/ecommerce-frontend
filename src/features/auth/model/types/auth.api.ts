// src/feature/auth/model/types/auth.api.ts
import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { User } from "./user.types";


export interface AuthResponseData {
  user: User;
  token?: string;
  access_token?: string;
  refresh_token?: string;
}

// الأنواع المخصصة لكل استجابة في الـ Auth Service
export type AuthLoginResponse = SuccessApiResponse<AuthResponseData>;
export type AuthRegisterResponse = SuccessApiResponse<AuthResponseData>;
export type AuthRefreshResponse = SuccessApiResponse<AuthResponseData>;

export type AuthMeResponse = SuccessApiResponse<{ user: User }>;
export type AuthUpdateProfileResponse = SuccessApiResponse<{ user: User }>;
export type AuthUpdateAvatarResponse = SuccessApiResponse<{ user: User }>;

export type AuthLogoutResponse = SuccessApiResponse<null>;
export type AuthUpdatePasswordResponse = SuccessApiResponse<null>;