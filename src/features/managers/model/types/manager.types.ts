// src/features/admin/managers/model/types/manager.types.ts

import type { UserStatus } from "@/features/users/model/types/user.types";

export interface ManagerStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
}

export interface ManagerFilters extends Record<string, unknown> {
  search?: string;
  role_id?: number;
  status?: UserStatus;
  page?: number;
  per_page?: number;
}