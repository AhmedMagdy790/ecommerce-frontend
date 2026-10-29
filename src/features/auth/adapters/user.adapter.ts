// src/features/users/adapters/user.adapter.ts

import type { PaginatedApiResponse, SuccessApiResponse } from "@/shared/types/api.types";
import type { CreateUserDto, UpdateUserDto } from "../model/types/auth.dto";
import type { User } from "@/features/users/model/types/user.types";
import type { UserFormData } from "@/features/users/model/schema/userSchema";


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
  toCreateDto(formData: UserFormData): CreateUserDto {
    return {
      name: formData.name,
      email: formData.email,
      status: formData.status,
      phone: formData.phone,
      password: formData.password,
      password_confirmed: formData.password_confirmed,
      roles: formData.roles ?? [],
      ...(formData.avatar ? { avatar: formData.avatar } : {}),
    };
  },

  toUpdateDto(formData: UserFormData): UpdateUserDto {
    return {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      ...(formData.password ? { password: formData.password, password_confirmed: formData.password_confirmed } : {}),
      roles: formData.roles,
      ...(formData.avatar ? { avatar: formData.avatar } : {}),
    };
  },
};