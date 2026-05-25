"use client";

import { useEffect, useState } from "react";
import { useLanguageStore, Language } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";

export function useTranslation() {
  const storeLanguage = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  
  // Hydration safety: return fallback "ua" until client mount is complete
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const language: Language = mounted ? storeLanguage : "ua";

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let current: any = translations[language];

    for (const k of keys) {
      if (current === undefined || current[k] === undefined) {
        // Fallback to "ua" dictionary if key is not found
        let fallback: any = translations["ua"];
        for (const fk of keys) {
          if (fallback === undefined || fallback[fk] === undefined) return key;
          fallback = fallback[fk];
        }
        current = fallback;
        break;
      }
      current = current[k];
    }

    if (typeof current !== "string") {
      return key;
    }

    let text = current;
    if (variables) {
      Object.entries(variables).forEach(([name, val]) => {
        text = text.replace(`{${name}}`, String(val));
      });
    }

    return text;
  };

  return { t, language, setLanguage, isTranslationReady: mounted };
}
