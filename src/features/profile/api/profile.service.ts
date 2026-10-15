// src/features/profile/api/profile.service.ts

import { profileApi } from "@/api/client";
import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { 
  UpdateAvatarDto, 
  UpdatePasswordDto, 
  UpdateProfileDto 
} from "@/features/auth/model/types/user.dto";
import type { User } from "@/features/auth/model/types/user.types";

export const profileService = {
  updateProfile(payload: UpdateProfileDto) {
    return profileApi.updateProfile<
      SuccessApiResponse<{ user: User }>,
      UpdateProfileDto
    >(payload);
  },

  updatePassword(payload: UpdatePasswordDto) {
    return profileApi.updatePassword<
      SuccessApiResponse<null>,
      UpdatePasswordDto
    >(payload);
  },

  updateAvatar(payload: UpdateAvatarDto) {
    return profileApi.updateAvatar<
      SuccessApiResponse<{ user: User }>,
      UpdateAvatarDto
    >(payload);
  },
};

export default profileService;