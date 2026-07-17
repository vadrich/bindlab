import { useEffect, useRef, useState } from 'react'
import { LOCALE_OPTIONS, type Locale } from '../i18n/locale'
import { useI18n } from '../i18n/I18nProvider'

const FLAG_SRC: Record<Locale, string> = {
  en: '/icons/flags/en.svg',
  zh: '/icons/flags/zh.svg',
  es: '/icons/flags/es.svg',
  hi: '/icons/flags/hi.svg',
  ru: '/icons/flags/ru.svg',
}

export function LanguageSwitcher() {
  const { locale, setLocale, m } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const current = LOCALE_OPTIONS.find((o) => o.id === locale) ?? LOCALE_OPTIONS[4]

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (id: Locale) => {
    setLocale(id)
    setOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className="relative flex shrink-0 items-center"
      title={m.lang.title}
    >
      {/* Collapsed: letters / glyphs only */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={m.lang.label}
        className={[
          'flex h-14 min-w-14 items-center justify-center rounded-2xl border px-3 font-semibold transition-all duration-300',
          open
            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_0_18px_rgba(var(--accent-rgb),0.35)]'
            : 'border-white/10 bg-[color-mix(in_srgb,var(--panel-inner)_85%,transparent)] text-[#c4c9d1] hover:border-[rgba(var(--accent-rgb),0.45)] hover:text-[var(--accent-muted)] hover:shadow-[0_0_14px_rgba(var(--accent-rgb),0.2)]',
        ].join(' ')}
      >
        <span className="text-xs tracking-wide">{current.short}</span>
      </button>

      {/* Expanded: flag icons to the left */}
      <div
        className={[
          'absolute right-full top-1/2 z-30 mr-2 flex -translate-y-1/2 items-center overflow-hidden transition-all duration-300',
          open
            ? 'max-w-[280px] opacity-100'
            : 'pointer-events-none max-w-0 opacity-0',
        ].join(' ')}
      >
        <div className="ui-panel flex items-center gap-1.5 !overflow-visible p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          {LOCALE_OPTIONS.map((opt) => {
            const active = locale === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => pick(opt.id)}
                title={opt.nativeLabel}
                className={[
                  'relative z-[1] flex h-9 w-11 items-center justify-center rounded-lg transition-all duration-200 hover:scale-110',
                  active
                    ? 'bg-[var(--accent-soft)] ring-1 ring-[var(--accent)] shadow-[0_0_12px_rgba(var(--accent-rgb),0.35)]'
                    : 'hover:bg-white/5',
                ].join(' ')}
              >
                <img
                  src={FLAG_SRC[opt.id]}
                  alt=""
                  draggable={false}
                  className="h-[18px] w-[27px] rounded-[2px] object-cover shadow-sm"
                />
                <span className="sr-only">{opt.nativeLabel}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
