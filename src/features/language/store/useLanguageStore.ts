// src/shared/store/useLanguageStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware"; // 👈 استيراد الـ persist middleware

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
  isActive: boolean;
  dir: "rtl" | "ltr";
}

interface LanguageState {
  languages: Language[];
  currentLangCode: string;
  activeLanguages: Language[];
  setCurrentLangCode: (code: string) => void;
  
  getCurrentLangObj: () => Language | undefined;
  getCurrentLangName: () => string;
}

const mockLanguages: Language[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", isDefault: true, isActive: true, dir: "rtl" },
  { code: "en", name: "English", nativeName: "English", isDefault: false, isActive: true, dir: "ltr" },
];

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      languages: mockLanguages,
      currentLangCode: mockLanguages.find((l) => l.isDefault)?.code || "ar",
      activeLanguages: mockLanguages.filter((l) => l.isActive),
      
      setCurrentLangCode: (code) => set({ currentLangCode: code }),

      getCurrentLangObj: () => {
        const state = get();
        return state.activeLanguages.find((l) => l.code === state.currentLangCode);
      },

      getCurrentLangName: () => {
        const state = get();
        const langObj = state.activeLanguages.find((l) => l.code === state.currentLangCode);
        return langObj?.nativeName || state.currentLangCode.toUpperCase();
      },
    }),
    {
      name: "app-language-storage", // 👈 المفتاح الذي سيتم تخزينه به في localStorage
      // يمكنك تحديد الحقول التي تريد حفظها فقط (اختياري)
      partialize: (state) => ({ currentLangCode: state.currentLangCode }),
    }
  )
);