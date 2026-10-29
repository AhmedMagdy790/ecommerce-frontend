// src/features/admin/managers/api/admin-user.service.ts

import { adminApi } from "@/api/client";
import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { User, UserFilters, UserStatus } from "../../users/model/types/user.types";
import type { UserListResponse } from "../../users/model/types/user.api";
import type { Role } from "@/features/roles/model/types/permission.types";
import type { EntityId } from "@/shared/types/entity";
import type { CreateMangerDto, UpdateMangerDto, UpdateUserRolesDto } from "../model/types/manager.dto";


export const managerService = {
  getAll(params?: UserFilters) {
    return adminApi.getManagers<UserListResponse>(params);
  },

  get(id: EntityId) {
    return adminApi.getManagerById<SuccessApiResponse<{ user: User }>>(id);
  },

  create(payload: CreateMangerDto) {
    return adminApi.createManager<
      SuccessApiResponse<{ user: User }>,
      CreateMangerDto
    >(payload);
  },

  update(id: EntityId, payload: UpdateMangerDto) {
    return adminApi.updateManager<
      SuccessApiResponse<{ user: User }>,
      UpdateMangerDto
    >(id, payload);
  },

  toggleStatus(id: EntityId, status: UserStatus) {
    return adminApi.toggleAdminStatus<
      SuccessApiResponse<{ user: User }>,
      { status: UserStatus}
    >(id, { status: status });
  },

  patch(id: EntityId, payload: UpdateMangerDto) {
    return adminApi.patchManager<
      SuccessApiResponse<{ user: User }>,
      UpdateMangerDto
    >(id, payload);
  },

  delete(id: EntityId) {
    return adminApi.deleteManager<SuccessApiResponse<null>>(id);
  },

  getAdminRoles(id: EntityId) {
    return adminApi.getAdminRoles<SuccessApiResponse<{ roles: Role[] }>>(id);
  },

  updateAdminRoles(id: EntityId, payload: UpdateUserRolesDto) {
    return adminApi.updateAdminRoles<
      SuccessApiResponse<{ user: User }>,
      UpdateUserRolesDto
    >(id, payload);
  },
};

export default managerService;