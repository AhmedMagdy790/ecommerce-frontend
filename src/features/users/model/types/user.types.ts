import type { Address } from "@/features/address/model/types/address.types";
import type { Role } from "@/features/roles/model/types/permission.types";

export type UserStatus = "active" | "pending" | "suspended";

export interface ProfileStats {
  total_orders?: number;
  active_orders?: number;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  phone?: string | null;

  avatar?: string | null;
  roles?: Role[];
  permissions?: string[];

  email_verified: boolean;
  email_verified_at?: string | null;

  joined_at?: string | null;
  last_login_at?: string | null;
  status?: UserStatus;
  stats?: ProfileStats;

  addresses?: Address[];
}

export interface UserFilters extends Record<string, unknown> {
  search?: string;
  role_id?: number;
  status?: UserStatus;
  page?: number;
  per_page?: number;
}

export interface UserStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
}