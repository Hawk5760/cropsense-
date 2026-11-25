import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { LanguageCode } from '../types/cropsense';
import {
  LANGUAGE_OPTIONS,
  translations,
  type TranslationDictionary,
} from '../data/translations';
import {
  dashboardTranslations,
  type DashboardExtendedTranslations,
} from '../data/dashboardTranslations';

const STORAGE_KEY = 'cropsense_language';

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: TranslationDictionary;
  dt: DashboardExtendedTranslations;
  speechLocale: string;
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getInitialLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'hi' || saved === 'mr' || saved === 'kn') {
      return saved;
    }
  } catch {
    // Ignore storage read issues
  }
  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Ignore storage write issues
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const speechLocale = useMemo(() => {
    return LANGUAGE_OPTIONS.find((opt) => opt.code === language)?.speechLocale ?? 'en-IN';
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: translations[language],
      dt: dashboardTranslations[language],
      speechLocale,
    }),
    [language, setLanguage, speechLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
