// src/feature/auth/model/types/auth.types.ts
import type { User } from "./user.types";

/**
 * البيانات المطلوبة لتسجيل الدخول (Login Payload)
 */
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * البيانات المطلوبة لإنشاء حساب جديد (Register Payload)
 */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

/**
 * هيكل الاستجابة القادم من الـ API عند نجاح المصادقة (تسجيل دخول / تسجيل حساب)
 */
export interface AuthResponse {
  user: User;
  token?: string;
  accessToken?: string;
  token_type?: string;
  expires_in?: string;
  refresh_updated?: boolean;
}

/**
 * الحالة (State) الخاصة بـ Auth Store
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * بيانات طلب إعادة تعيين كلمة المرور
 */
export interface ForgotPasswordPayload {
  email: string;
}

/**
 * بيانات تعيين كلمة المرور الجديدة
 */
export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}