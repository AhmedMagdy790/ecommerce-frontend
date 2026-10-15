// src/features/roles/api/role.service.ts

import { adminApi } from "@/api/client";
import type { Permission, Role } from "@/features/roles/model/types/permission.types";
import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { EntityId } from "@/shared/types/entity";

export const roleService = {

  getAll() {
    return adminApi.getRoles<SuccessApiResponse<{ roles: Role[] }>>();
  },

  getAllPermissions() {
    return adminApi.getAllPermissions<SuccessApiResponse<{ permissions: Permission[] }>>();
  },



  getRoleById(id: EntityId) {
    return adminApi.getRoleById<SuccessApiResponse<{ role: Role }>>(id);
  },

  updatePermissions(id: EntityId, permissions: string[]) {
    return adminApi.updateRolePermissions<
      SuccessApiResponse<{ role: Role }>,
      { permissions: string[] }
    >(id, { permissions });
  },

};

export default roleService;