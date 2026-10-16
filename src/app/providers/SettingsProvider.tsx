import { createContext, useMemo, type ReactNode } from "react";
import { defaultSettings } from "@/config/site";
import { useSettingsStore } from "@/store/useSettingsStore";

export type Settings = typeof defaultSettings & Record<string, unknown>;

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {

  const { 
    settings: storeSettings, 
    isLoading: loading, 
    getAllSettings
  } = useSettingsStore();


  const settings = useMemo(() => {
    return { ...defaultSettings, ...(storeSettings || {}) };
  }, [storeSettings]);

  const value = useMemo(
    () => ({
      settings,
      loading,
      refresh: getAllSettings
    }),
    [settings, loading, getAllSettings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsContext };