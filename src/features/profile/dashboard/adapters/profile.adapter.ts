// src/features/profile/adapters/profile.adapter.ts
import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { 
  UpdatePasswordDto
} from "@/features/auth/model/types/auth.dto";
import type { UpdateUserDto } from "@/features/users/model/types/user.dto";
import type { UserFormData } from "@/features/users/model/schema/userSchema";
import type { ProfileFormData } from "../model/schema/profileSchema";
import type { User } from "@/features/users/model/types/user.types";


export const profileAdapter = {
  fromUpdateProfileResponse(response: SuccessApiResponse<{ user: User }>): User {
    return response.data.user;
  },

  fromUpdateAvatarResponse(response: SuccessApiResponse<{ user: User }>): User {
    return response.data.user;
  },

  toUpdateDto(value: ProfileFormData): UpdateUserDto {
    return value;
  },

  toPasswordDto(value: UpdatePasswordDto): UpdateUserDto {
    return value;
  },

  toAvatarDto(value: UserFormData): UpdateUserDto {
    return value;
  },
};