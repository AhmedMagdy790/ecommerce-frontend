import { create } from "zustand";
import type { User } from "@/features/auth/model/types/user.types";
import type { 
  UpdateProfileDto, 
  UpdatePasswordDto, 
  UpdateAvatarDto 
} from "@/features/auth/model/types/user.dto";
import profileService from "@/features/profile/api/profile.service";

interface ProfileState {
  user: User | null;
  isLoading: boolean;
  isSubmitting: boolean;
  submitError: unknown | null;

  // Actions
  setUser: (user: User | null) => void;
  updateProfile: (payload: UpdateProfileDto) => Promise<void>;
  updatePassword: (payload: UpdatePasswordDto) => Promise<void>;
  updateAvatar: (payload: UpdateAvatarDto) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  isLoading: false,
  isSubmitting: false,
  submitError: null,

  setUser: (user) => set({ user }),

  updateProfile: async (payload: UpdateProfileDto) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await profileService.updateProfile(payload);
      
      // تحديث بيانات المستخدم في الستور بالبيانات الجديدة القادمة من الـ API
      if (response.data?.user) {
        set({ user: response.data.user, isSubmitting: false });
      } else {
        set({ isSubmitting: false });
      }
    } catch (error) {
      set({ isSubmitting: false, submitError: error });
      throw error;
    }
  },

  updatePassword: async (payload: UpdatePasswordDto) => {
    set({ isSubmitting: true, submitError: null });
    try {
      await profileService.updatePassword(payload);
      set({ isSubmitting: false });
    } catch (error) {
      set({ isSubmitting: false, submitError: error });
      throw error;
    }
  },

  updateAvatar: async (payload: UpdateAvatarDto) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await profileService.updateAvatar(payload);
      
      if (response.data?.user) {
        set({ user: response.data.user, isSubmitting: false });
      } else {
        set({ isSubmitting: false });
      }
    } catch (error) {
      set({ isSubmitting: false, submitError: error });
      throw error;
    }
  },
}));