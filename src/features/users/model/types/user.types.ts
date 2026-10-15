import type { Role } from "@/features/roles/model/types/permission.types";

export type UserStatus =
  | "active"
  | "pending"
  | "suspended";

export interface User {
  id: number | string;
  name: string;
  email: string;
  phone?: string | null;
  roles?: Role[];
  avatar?: string | null;
  last_login_at?: string | null;
  status: UserStatus;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserFilters extends Record<string, unknown> {
  search?: string;
  role_id?: number;
  status?: UserStatus;
  page?: number;
  per_page?: number;
}

export interface UserStats  {
  total: number;
  active: number;
  pending: number;
  suspended: number;
}