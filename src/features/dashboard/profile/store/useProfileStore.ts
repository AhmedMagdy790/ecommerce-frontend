import { create } from "zustand";
import { type IUpdateProfilePayload } from "../types/profileTypes";
import { profileService } from "../services/profileService";
import toast from "react-hot-toast";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { useAuthStore } from "@/store/authStore";

interface ProfileState {
  loading: boolean;
  updateProfile: (payload: IUpdateProfilePayload) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

const { show, hide } = useStatusStore.getState();


export const useProfileStore = create<ProfileState>((set) => ({
  loading: false,

  updateProfile: async (payload) => {
    set({ loading: true });
   
    try {
    
      const updatedUser = await profileService.updateProfileInfo(payload);

      const setUserInAuth = useAuthStore.getState().setUser;

      if (setUserInAuth) {
        setUserInAuth(updatedUser);
      }
    
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updatePassword: async (passwordPayload) => {
    
  },

  updateAvatar: async (file: File) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      show("loading", "جاري رفع الصورة");

         
      const updatedUser = await profileService.updateAvatar(formData);
         
      show("success", "Saved successfully!");
      setTimeout(() => hide(), 1200);

      console.log(updatedUser)

      useAuthStore.getState().setUser(updatedUser);

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل رفع الصورة');
    } finally {
      set({ loading: false });
    }
  }
}));