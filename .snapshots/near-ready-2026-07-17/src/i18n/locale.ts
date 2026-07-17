export type Locale = 'en' | 'zh' | 'es' | 'hi' | 'ru'

/** Top spoken languages worldwide, with Russian included. */
export const LOCALE_OPTIONS: {
  id: Locale
  nativeLabel: string
  short: string
}[] = [
  { id: 'en', nativeLabel: 'English', short: 'EN' },
  { id: 'zh', nativeLabel: '中文', short: '中文' },
  { id: 'es', nativeLabel: 'Español', short: 'ES' },
  { id: 'hi', nativeLabel: 'हिन्दी', short: 'HI' },
  { id: 'ru', nativeLabel: 'Русский', short: 'RU' },
]

export const LOCALE_SET = new Set<string>(LOCALE_OPTIONS.map((l) => l.id))

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALE_SET.has(value)
}

const LOCALE_KEY = 'cs2-bind-locale'

export function loadLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (isLocale(saved)) return saved
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || 'en').toLowerCase()
  if (nav.startsWith('zh')) return 'zh'
  if (nav.startsWith('es')) return 'es'
  if (nav.startsWith('hi')) return 'hi'
  if (nav.startsWith('ru')) return 'ru'
  if (nav.startsWith('en')) return 'en'
  return 'ru'
}

export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    /* ignore */
  }
}
