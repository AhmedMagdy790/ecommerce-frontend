// src/features/users/adapters/user.adapter.ts

import type { PaginatedApiResponse, SuccessApiResponse } from "@/shared/types/api.types";
import type { CreateUserDto, UpdateUserDto } from "../model/types/user.dto";
import type { CreateUserFormData } from "../model/schema/user.schema";
import type { User } from "../model/types/user.types";


export const userAdapter = {
  fromListResponse(response: PaginatedApiResponse<User>): User[] {
    return response.data.items;
  },

  fromSingleResponse(response: SuccessApiResponse<{ user: User }>): User {
    return response.data.user;
  },

  fromCreateResponse(response: SuccessApiResponse<{ user: User }>): User {
    return response.data.user;
  },

  fromUpdateResponse(response: SuccessApiResponse<{ user: User }>): User {
    return response.data.user;
  },

  // إذا كنت تستخدم Form Data أو Zod Form Data للإنشاء والتعديل
  toCreateDto(formData: CreateUserFormData): CreateUserDto {
    return {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      roles: formData.roles ?? [],
      ...(formData.avatar ? { avatar: formData.avatar } : {}),
    };
  },

  toUpdateDto(formData: CreateUserFormData): UpdateUserDto {
    return {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      ...(formData.password ? { password: formData.password, password_confirmation: formData.password_confirmation } : {}),
      roles: formData.roles,
      ...(formData.avatar ? { avatar: formData.avatar } : {}),
    };
  },
};