// src/features/roles/store/role.store.ts

import { create } from "zustand";
import roleService from "../../api/role.service";
import type { Permission, Role } from "../types/permission.types";
import { getErrorMessage } from "@/shared/utils/handleServerError";

interface RoleState {
  roles: Role[];
  permissions: Permission[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchRoles: () => Promise<void>;
  fetchPermissions: () => Promise<void>;
  updateRolePermissions: (roleId: number | string, permissions: string[]) => Promise<void>;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  permissions: [],
  isLoading: false,
  error: null,

  fetchRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await roleService.getAll();
      // دعم كلتا الحالتين سواء كانت الاستجابة مباشرة كـ Array أو كائن يحتوي على roles
      const rolesData = response.data?.roles || [];

      set({ roles: rolesData, isLoading: false });
    } catch (error: unknown) {
      set({ error: getErrorMessage(error, "حدث خطأ أثناء جلب الأدوار"), isLoading: false });
    }
  },

  fetchPermissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await roleService.getAllPermissions();
      const permissionsData = Array.isArray(response.data)
        ? response.data
        : response.data?.permissions || [];

      set({ permissions: permissionsData, isLoading: false });
    } catch (error: unknown) {
      set({ error: getErrorMessage(error, "فشل جلب الصلاحيات"), isLoading: false });
    }
  },

  updateRolePermissions: async (roleId, permissions) => {
    const response = await roleService.updatePermissions(roleId, permissions);
    const updatedRole = response.data?.role || response.data;

    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === roleId ? updatedRole : role
      ),
    }));
  },
}));