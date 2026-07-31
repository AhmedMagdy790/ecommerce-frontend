import { SettingsContext } from "@/app/providers/SettingsProvider";
import { useContext } from "react";

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}