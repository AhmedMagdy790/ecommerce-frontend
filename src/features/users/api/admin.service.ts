// src/features/users/api/admin-user.service.ts

import { adminApi } from "@/api/client";
import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { EntityId } from "@/shared/types/entity";

export const adminUserService = {
  // جلب أدوار مشرف معين بالـ ID
  getAdminRoles(id: EntityId) {
    return adminApi.getAdminRoles<SuccessApiResponse<{ roles: string[] }>>(id);
  },

  // تحديث / منح أدوار للمشرف
  updateAdminRoles(id: EntityId, roles: string[]) {
    return adminApi.updateAdminRoles<
      SuccessApiResponse<any>,
      { roles: string[] }
    >(id, { roles });
  },
};

export default adminUserService;