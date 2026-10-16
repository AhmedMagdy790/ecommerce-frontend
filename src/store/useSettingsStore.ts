import { create } from "zustand";
import { storeApi } from "@/api/client";

type SettingValue = string | number | boolean | null;

type SettingsData = Record<string, SettingValue>;

interface ISettingsState {
  settings: SettingsData | null;
  isLoading: boolean;
  getAllSettings: () => Promise<void>;
}

export const useSettingsStore = create<ISettingsState>((set, get) => ({
  settings: null,
  isLoading: false,

  getAllSettings: async () => {
    if (get().isLoading) return;

    set({ isLoading: true });

    try {
      const response = await storeApi.getAllSettings();
      const settingsData = response?.data?.settings;

      if (settingsData) {
        set({ settings: settingsData });
      }
    } catch (error: unknown) {
      console.error("Failed to fetch public settings:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));