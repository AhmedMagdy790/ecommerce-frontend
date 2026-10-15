// src/types/permission.types.ts

import type { EntityId } from "@/shared/types/entity";

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: EntityId;
  team_id?: number | null; // يتوافق مع إعدادات الـ teams إذا كانت مفعلة
  name: string;
  guard_name: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface ModelHasPermission {
  permission_id: number;
  model_type: string;
  model_id: number;
  team_id?: number;
}

export interface ModelHasRole {
  role_id: number;
  model_type: string;
  model_id: number;
  team_id?: number;
}

export interface RoleHasPermission {
  permission_id: number;
  role_id: number;
}

// نموذج مستخدم افتراضي يحتوي على الصلاحيات والأدوار (Roles & Permissions) شائع الاستخدام في الواجهات الأمامية
export interface UserWithPermissions {
  id: number;
  name: string;
  email: string;
  roles?: Role[];
  permissions?: Permission[];
}