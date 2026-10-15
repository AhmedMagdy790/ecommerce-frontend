// src/features/users/adapters/user.adapter.ts

import type { PaginatedApiResponse, PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { CreateUserDto, UpdateUserDto } from "../model/types/user.dto";
import { extractStatsSafely } from "@/shared/utils/helper";
import type { User, UserStats } from "../model/types/user.types";
import type { UserListResponse } from "../model/types/user.api";
import type { UserFormData } from "../model/schema/userSchema";

export const userAdapter = {
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

  extractStats(response: UserListResponse): UserStats {
    return extractStatsSafely(response.data.stats, {
      total: 0,
      active: 0,
      pending: 0,
      suspended: 0,
    });
  },

  toCreateDto(formData: UserFormData): CreateUserDto {
    return {
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

  toUpdateDto(formData: UserFormData): UpdateUserDto {
    const dto: UpdateUserDto = {
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