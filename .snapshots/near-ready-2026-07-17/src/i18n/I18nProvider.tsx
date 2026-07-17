import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadLocale, saveLocale, type Locale } from './locale'
import { en, type Messages } from './messages/en'
import { es } from './messages/es'
import { hi } from './messages/hi'
import { ru } from './messages/ru'
import { zh } from './messages/zh'

const CATALOG: Record<Locale, Messages> = { en, zh, es, hi, ru }

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  m: Messages
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(loadLocale)

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    saveLocale(next)
  }

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      m: CATALOG[locale] ?? en,
    }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}

export function useMessages(): Messages {
  return useI18n().m
}
