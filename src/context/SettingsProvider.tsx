import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { defaultSettings } from "@/config/site";

export type Settings = typeof defaultSettings;

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refresh: () => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    // عند وجود API استبدل الكود التالي

    /*
    setLoading(true);

    try {
      const response = await fetch("/api/settings");

      if (!response.ok) {
        throw new Error("Failed to fetch settings.");
      }

      const data: Settings = await response.json();

      setSettings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    */
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      settings,
      loading,
      refresh,
    }),
    [settings, loading, refresh]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}