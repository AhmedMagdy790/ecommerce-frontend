import type { User } from "@/features/users/model/types/user.types";
import type { LoginDto } from "../model/types/auth.dto";


export interface AuthResponse {
  user: User;
  token?: string;
  accessToken?: string;
  refresh_token?: string;
  refresh_updated?: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  accessTokenExpiresAt: number | null;
  lastTokenActivityAt: number | null,
  isLoading: boolean;
  isLoggingOut: boolean;
  isInitialized: boolean;
  isRefreshing: boolean;
  setUser(user: User | null): void;
  setAccessToken(accessToken: string | null): void;
  setInitialized(value: boolean): void;
  clearAuth(): void;
  initializeAuth(): Promise<void>;
  login(data: LoginDto): Promise<void>;
  createAcount(data: import("../model/types/auth.dto").RegisterDto): Promise<void>;
  forgotPassword(data: import("../model/types/auth.dto").ForgotPasswordDto): Promise<void>;
  logout(): Promise<void>;
  fetchUser(): Promise<void>;
  updateAccessToken(): Promise<string>;
  rotateAccessToken(): Promise<boolean>;
}
