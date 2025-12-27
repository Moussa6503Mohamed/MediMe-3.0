"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { translations } from "@/lib/i18n";

export const useI18n = () => {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const t = useCallback(
    (key: keyof (typeof translations)["en"], params: Record<string, string | number> = {}): string => {
      const lang = translations[language] || translations.en;
      let translation = lang[key as keyof typeof lang] || key;

      Object.keys(params).forEach((paramKey) => {
        translation = translation.replace(
          new RegExp(`{${paramKey}}`, "g"),
          String(params[paramKey])
        );
      });

      return translation;
    },
    [language]
  );

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return { t, language, setLanguage, toggleLanguage };
};
