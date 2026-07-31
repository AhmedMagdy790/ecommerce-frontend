import { authApi } from "@/api/client";
import { type ILoginResponse, type ILoginPayload, type IRegisterPayload, type ApiUserResponse, type ApiRotateResponse, type ApiUpdateTokenResponse, type IUserUpdatePayload, type IRegisterResponse } from "../types/authType";
import axios from "axios";
import { env } from "@/config/config";
import { unwrapResponse } from "@/shared/utils/helper";

export const authService = {

  async csrf() {
    await axios.get(`${env.API_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  },

  async login(data: ILoginPayload) {
    const response = await authApi.login(data);

    return unwrapResponse<ILoginResponse>(response);
  },

  async register(data: IRegisterPayload) {
    const response = await authApi.register(data);

    return unwrapResponse<IRegisterResponse>(response);
  },

  async logout() {
    const response = await authApi.logout();

    return unwrapResponse(response);
  },

  async updateAccessToken() {
    const response = await authApi.refresh();

    return unwrapResponse<ApiUpdateTokenResponse>(response);
  },

  async rotateAccessToken() {
    const response = await authApi.rotateRefresh();

    return unwrapResponse<ApiRotateResponse>(response);
  },

  async me() {
    const response = await authApi.me();

    return unwrapResponse<ApiUserResponse>(response);
  },

  async refresh() {
    const response = await authApi.refresh();

    return unwrapResponse(response);
  },

  async rotateRefresh() {
    const response = await authApi.rotateRefresh();

    return unwrapResponse(response);
  },

  async updateProfile(data: IUserUpdatePayload) {
    const response = await authApi.updateProfile(data);

    return unwrapResponse<ApiUserResponse>(response);
  },
};