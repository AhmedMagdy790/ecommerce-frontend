// src/features/managers/adapters/manager.adapter.ts

import type { PaginatedApiResponse, PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import { extractStatsSafely } from "@/shared/utils/helper";
import type { ManagerFormData } from "@/features/managers/model/schema/managerSchema";
import type { CreateMangerDto, UpdateMangerDto } from "@/features/managers/model/types/manager.dto";
import type { User, UserStats } from "@/features/users/model/types/user.types";
import type { ManagerListResponse } from "../model/types/manager.api";

export const managerAdapter = {
  fromListResponse(response: PaginatedApiResponse<User>): User[] {
    return response.data.items;
  },

  fromCreateResponse(response: SuccessApiResponse<{ user: User }>): User {
    return response.data.user;
  },

  fromUpdateResponse(response: SuccessApiResponse<{ user: User }>): User {
    return response.data.user;
  },

  fromToggleResponse(response: SuccessApiResponse<{ user: User }>): User {
    return response.data.user;
  },

  extractPagination(response: PaginatedApiResponse<User>): PaginationMeta {
    return (
      response.data.pagination ?? {
        type: "server",
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      }
    );
  },

  extractStats(response: ManagerListResponse): UserStats {
    return extractStatsSafely(response.data.stats, {
      total: 0,
      active: 0,
      pending: 0,
      suspended: 0,
    });
  },

  toCreateDto(formData: ManagerFormData): CreateMangerDto {

    if (formData.mode === "select" && formData.user_id) {
      return {
        mode: formData.mode,
        user_id: formData.user_id,
        roles: formData.roles,
        status: formData.status ?? "active",
      };
    }

    return {
      mode: formData.mode,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      status: formData.status ?? "active",
      roles: formData.roles,
      ...(formData.avatar ? { avatar: formData.avatar } : {}),
      ...(formData.password ? { password: formData.password } : {}),
      ...(formData.password_confirmation
        ? { password_confirmation: formData.password_confirmation }
        : {}),
    };
  },

  toUpdateDto(formData: ManagerFormData): UpdateMangerDto {
    const dto: UpdateMangerDto = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      status: formData.status,
      roles: formData.roles,
      ...(formData.avatar ? { avatar: formData.avatar } : {}),
    };

    if (formData.password) {
      dto.password = formData.password;
    }
    if (formData.password_confirmation) {
      dto.password_confirmation = formData.password_confirmation;
    }

    return dto;
  },
};