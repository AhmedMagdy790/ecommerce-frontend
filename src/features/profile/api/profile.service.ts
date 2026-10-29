// src/features/profile/api/profile.service.ts

import { profileApi } from "@/api/client";
import type { SuccessApiResponse } from "@/shared/types/api.types";
import type {  
  UpdatePasswordDto, 
} from "@/features/auth/model/types/auth.dto";
import type { User } from "@/features/users/model/types/user.types";
import type { UpdateUserDto } from "@/features/users/model/types/user.dto";

export const profileService = {
  updateProfile(payload: UpdateUserDto) {
    return profileApi.updateProfile<
      SuccessApiResponse<{ user: User }>,
      UpdateUserDto
    >(payload);
  },

  updatePassword(payload: UpdatePasswordDto) {
    return profileApi.updatePassword<
      SuccessApiResponse<null>,
      UpdatePasswordDto
    >(payload);
  },

  updateAvatar(payload: UpdateUserDto) {
    return profileApi.updateAvatar<
      SuccessApiResponse<{ user: User }>,
      UpdateUserDto
    >(payload);
  },
};

export default profileService;