// src/features/admin/managers/store/user.store.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";
import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { Role } from "@/features/roles/model/types/permission.types";
import type { EntityId } from "@/shared/types/entity";
import type { UpdateUserRolesDto } from "../types/manager.dto";
import type { User, UserStatus } from "@/features/users/model/types/user.types";
import type { CreateUserDto, UpdateUserDto } from "@/features/users/model/types/user.dto";
import type { UserListResponse } from "@/features/users/model/types/user.api";
import managerService from "../../api/managers.service";
import { getErrorMessage } from "@/shared/utils/handleServerError";
import type { ManagerFilters } from "../types/manager.types";
import { ManagerStatsHooks } from "./mangerStatsHooks";

/* =========================================================
 * Custom State & Actions Interface
 * =======================================================*/

export interface ManagerCustomState {
  managerRoles: Role[];
  isRolesLoading: boolean;
  rolesError: string | null;

  // حالة جاري تغيير الوضع (Toggle Status)
  togglingStatusId: EntityId | null;
  statusError: string | null;

  getRoles: (id: EntityId) => Promise<Role[] | undefined>;

  updateRoles: (
    id: EntityId,
    payload: UpdateUserRolesDto
  ) => Promise<boolean>;

  // إجراء تغيير الحالة
  changeStatus: (id: EntityId, status: UserStatus) => Promise<boolean>;
}

/* =========================================================
 * Store Instance
 * =======================================================*/

export const useManagerStore = createFeatureStore<
  User,
  CreateUserDto,
  UpdateUserDto,
  ManagerFilters,
  UserListResponse,
  SuccessApiResponse<{ user: User }>,
  SuccessApiResponse<null>,
  SuccessApiResponse<{ user: User }>,
  UserListResponse,
  SuccessApiResponse<{ user: User }>,
  SuccessApiResponse<null>,
  ManagerCustomState,
  boolean
>({
  name: "ManagerStore",

  service: {
    getAll: managerService.getAll,
    get: managerService.get,
    create: managerService.create,
    update: managerService.update,
    delete: managerService.delete,
  },

  adapter: {
    fromListResponse: (res) => res.data?.items ?? [],
    extractPagination: (res) => res.data?.pagination,
    fromCreateResponse: (res) => res.data?.user,
    fromUpdateResponse: (res) => res.data?.user,
  },

  hooks: {
    onFetched: (response) => {
      ManagerStatsHooks.onFetched(response.data?.stats);
    },
    onCreated: ManagerStatsHooks.onCreated,
    onDeleted: ManagerStatsHooks.onDeleted,
  },

  defaultFilters: {
    page: 1,
    per_page: 15,
    search: "",
  },

  defaultSortBy: "created_at",

  customActions: ({ set, get }) => ({
    managerRoles: [],
    isRolesLoading: false,
    rolesError: null,
    togglingStatusId: null,
    statusError: null,

    getRoles: async (id: EntityId) => {
      set({ isRolesLoading: true, rolesError: null });
      try {
        const response = await managerService.getAdminRoles(id);
        const roles = response.data?.roles || [];
        set({ managerRoles: roles, isRolesLoading: false });
        return roles;
      } catch (error: unknown) {
        set({
          rolesError: getErrorMessage(error, "حدث خطأ ما أثناء جلب الصلاحيات"),
          isRolesLoading: false,
        });

        return undefined;
      }
    },

    updateRoles: async (id: EntityId, payload: UpdateUserRolesDto) => {
      set({ isRolesLoading: true, rolesError: null });
      try {
        await managerService.updateAdminRoles(id, payload);
        set({ isRolesLoading: false });

        // إعادة جلب بيانات القائمة بعد التحديث
        get().fetch();
        return true;
      } catch (error: unknown) {
        set({
          rolesError: getErrorMessage(error, "حدث خطأ ما أثناء تحديث الصلاحيات"),
          isRolesLoading: false,
        });

        return false;
      }
    },

    changeStatus: async (id: EntityId, status: UserStatus) => {
      set({ togglingStatusId: id, statusError: null });

      // الاحتفاظ بالحالة القديمة للتراجع عنها في حال فشل الطلب
      const previousItems = get().items;

      // تحديث الحالة فورياً في الـ State (Optimistic UI Update)
      set({
        items: previousItems.map((item) =>
          item.id === id ? { ...item, status } : item
        ),
      });

      try {
        await managerService.toggleStatus(id, status);

        set({ togglingStatusId: null });
        return true;
      } catch (error: unknown) {
        // التراجع عن التغيير عند فشل السيرفر
        set({
          items: previousItems,
          statusError: getErrorMessage(error, "فشل تغيير حالة المشرف"),
          togglingStatusId: null,
        });
        return false;
      }
    },
  }),
});