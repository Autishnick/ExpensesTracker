import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Language = "ua" | "en";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "ua",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "family-tracker-lang",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
