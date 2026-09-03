import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { translations, type Language, type TranslationKey } from '../i18n';
import { STORAGE_KEYS } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language | null;
    return saved ?? 'ro';
  });

  const setLanguage = useCallback((next: Language) => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, next);
    setLanguageState(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[language][key] ?? translations.ro[key] ?? key,
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
