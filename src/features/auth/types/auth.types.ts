import type { User } from "../model/types/user.types";

export type {
  User,
  Address,
  UserFilters,
} from "../model/types/user.types";

export type {
  LoginDto as LoginCredentials,
  RegisterDto as RegisterPayload,
  UpdateProfileDto,
  UpdatePasswordDto,
  UpdateAvatarDto,
} from "../model/types/user.dto";

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
  isLoading: boolean;
  isLoggingOut: boolean;
  isInitialized: boolean;
  isRefreshing: boolean;
  setUser(user: User | null): void;
  setAccessToken(accessToken: string | null): void;
  setInitialized(value: boolean): void;
  clearAuth(): void;
  initializeAuth(): Promise<void>;
  login(data: import("../model/types/user.dto").LoginDto): Promise<void>;
  createAcount(data: import("../model/types/user.dto").RegisterDto): Promise<void>;
  logout(): Promise<void>;
  fetchUser(): Promise<void>;
  updateAccessToken(): Promise<string | undefined>;
  rotateAccessToken(): Promise<boolean>;
}
