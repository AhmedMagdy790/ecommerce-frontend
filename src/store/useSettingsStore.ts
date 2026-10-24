
import { create } from "zustand";
import { storeApi } from "@/api/client";

type SettingValue = string | number | boolean | null;
type SettingsData = Record<string, SettingValue>;

interface ISettingsState {
  settings: SettingsData | null;
  isLoading: boolean;
  getAllSettings: () => Promise<void>;
}

// Shared across callers and Strict Mode's simulated remount.
let settingsRequest: Promise<void> | null = null;

export const useSettingsStore = create<ISettingsState>((set, get) => ({
  settings: null,
  isLoading: false,

  getAllSettings: async () => {
    // Settings already loaded.
    if (get().settings !== null) return;

    // Reuse the in-flight request.
    if (settingsRequest) return settingsRequest;

    set({ isLoading: true });

    settingsRequest = (async () => {
      try {
        const response = await storeApi.getAllSettings();
        const settingsData = response?.data?.settings;

        if (settingsData != null) {
          set({ settings: settingsData });
        }
      } catch (error: unknown) {
        console.error("Failed to fetch public settings:", error);
      } finally {
        settingsRequest = null;
        set({ isLoading: false });
      }
    })();

    return settingsRequest;
  },
}));
