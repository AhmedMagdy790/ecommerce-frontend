import { create } from "zustand";
import toast from "react-hot-toast";
import { adminApi } from "@/api/client";

interface ISettingsState {
  settings: Record<string, any> | null;
  isLoading: boolean;
  isUpdating: boolean;
  
  // Actions
  getAllSettings: () => Promise<void>;
  updateSettings: (data: Record<string, any>) => Promise<boolean>;
}

export const useSettingsStore = create<ISettingsState>((set, get) => ({
  settings: null,
  isLoading: false,
  isUpdating: false,

  getAllSettings: async () => {

    if (get().isLoading) return;

    set({ isLoading: true });
    try {
      const response = await adminApi.getAllSettings();

      const settingsData = response.data || response;
      
      set({ settings: settingsData });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("فشل تحميل الإعدادات");
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (data) => {
    set({ isUpdating: true });
    try {
      const response = await adminApi.updateSettings(data);
      const updatedData = response.data || response;

      set({ settings: updatedData });
      

      toast.success("تم تحديث الإعدادات بنجاح");
      return true;
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("فشل تحديث الإعدادات");
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },
}));