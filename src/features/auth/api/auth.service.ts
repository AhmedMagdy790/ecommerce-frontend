// src/features/auth/api/auth.service.ts

import { authApi } from "@/api/client";
import type { SuccessApiResponse } from "@/shared/types/api.types";

import type {
  AuthResponse,
} from "../model/types/auth.types";

import type { ForgotPasswordDto, RegisterDto } from "../model/types/auth.dto";
import type { LoginFormData } from "../model/schema/loginSchema";
import type { User } from "@/features/users/model/types/user.types";

export const authServices = {
  login(payload: LoginFormData) {
    return authApi.login<
      SuccessApiResponse<AuthResponse>,
      LoginFormData
    >(payload);
  },

  register(payload: RegisterDto) {
    return authApi.register<
      SuccessApiResponse<AuthResponse>,
      RegisterDto
    >(payload);
  },

  logout() {
    return authApi.logout<
      SuccessApiResponse<null>
    >();
  },

  forgotPassword(payload: ForgotPasswordDto) {
    return authApi.forgotPassword<
      SuccessApiResponse<AuthResponse>
    >(payload);
  },
  

  me() {
    return authApi.me<
      SuccessApiResponse<{ user: User }>
    >();
  },

  getAccessToken() {
    return authApi.getAccessToken<
      SuccessApiResponse<AuthResponse>
    >();
  },

  refresh() {
    return authApi.refresh<
      SuccessApiResponse<AuthResponse>
    >();
  },

  rotateRefresh() {
    return authApi.rotateRefresh<
      SuccessApiResponse<AuthResponse>
    >();
  }
};

export default authServices;