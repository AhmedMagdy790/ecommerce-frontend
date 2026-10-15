// src/features/profile/adapters/profile.adapter.ts
import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { 
  UpdateProfileDto, 
  UpdatePasswordDto, 
  UpdateAvatarDto 
} from "@/features/auth/model/types/user.dto";
import type { User } from "@/features/auth/model/types/user.types";

export const profileAdapter = {
  fromUpdateProfileResponse(response: SuccessApiResponse<{ user: User }>): User {
    return response.data.user;
  },

  fromUpdateAvatarResponse(response: SuccessApiResponse<{ user: User }>): User {
    return response.data.user;
  },

  toUpdateDto(value: UpdateProfileDto): UpdateProfileDto {
    return value;
  },

  toPasswordDto(value: UpdatePasswordDto): UpdatePasswordDto {
    return value;
  },

  toAvatarDto(value: UpdateAvatarDto): UpdateAvatarDto {
    return value;
  },
};