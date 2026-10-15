import { create } from "zustand";
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

      console.log("response3333", response)
      const settingsData = response?.data?.settings;
      
      set({ settings: settingsData });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (data) => {
    set({ isUpdating: true });
    try {
      const response = await adminApi.updateSettings(data);
      const updatedData = response?.data?.settings;

      set({ settings: updatedData });
      

      return true;
    } catch (error) {
      console.error("Failed to update settings:", error);
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },
}));