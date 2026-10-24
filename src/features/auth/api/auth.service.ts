// src/features/auth/api/auth.service.ts

import { authApi } from "@/api/client";
import type { SuccessApiResponse } from "@/shared/types/api.types";

import type {
  AuthResponse,
} from "../model/types/auth.types";

import type { LoginDto, RegisterDto } from "../model/types/user.dto";
import type { User } from "../model/types/user.types";

export const authServices = {
  login(payload: LoginDto) {
    return authApi.login<
      SuccessApiResponse<AuthResponse>,
      LoginDto
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