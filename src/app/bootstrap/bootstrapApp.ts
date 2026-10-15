import { useSettingsStore } from "@/store/useSettingsStore";


export async function bootstrapApp(): Promise<void> {
  try {

    await Promise.all([
      useSettingsStore.getState().getAllSettings(),
    ]);
    
    console.log("App bootstrap completed successfully 🚀");
  } catch (error) {
    console.error("App bootstrap failed:", error);
  }
}