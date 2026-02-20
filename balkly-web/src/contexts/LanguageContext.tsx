"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "@/i18n/en";
import bs from "@/i18n/bs";
import de from "@/i18n/de";
import type { Translations } from "@/i18n/en";

export type Language = "en" | "bs" | "de";

const LANG_KEY = "balkly_language";

const translations: Record<Language, Translations> = { en, bs, de };

export const languageLabels: Record<Language, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  bs: { label: "Balkly", flag: "🌍" },
  de: { label: "Deutsch", flag: "🇩🇪" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Language | null;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
