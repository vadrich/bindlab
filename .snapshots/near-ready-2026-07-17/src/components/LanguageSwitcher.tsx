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
          'flex h-14 min-w-14 items-center justify-center rounded-lg border px-3 font-semibold transition-colors',
          open
            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
            : 'border-[#2a3340] bg-[#0d1117] text-[#c4c9d1] hover:border-[var(--accent)]/50 hover:text-[var(--accent-muted)]',
        ].join(' ')}
      >
        <span className="text-xs tracking-wide">{current.short}</span>
      </button>

      {/* Expanded: flag icons to the left */}
      <div
        className={[
          'absolute right-full top-1/2 z-30 mr-2 flex -translate-y-1/2 items-center overflow-hidden transition-all duration-200',
          open
            ? 'max-w-[280px] opacity-100'
            : 'pointer-events-none max-w-0 opacity-0',
        ].join(' ')}
      >
        <div className="flex items-center gap-1.5 rounded-lg border border-[#2a3340] bg-[#0d1117] p-1.5 shadow-lg shadow-black/40">
          {LOCALE_OPTIONS.map((opt) => {
            const active = locale === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => pick(opt.id)}
                title={opt.nativeLabel}
                className={[
                  'flex h-9 w-11 items-center justify-center rounded-md transition-transform hover:scale-105',
                  active
                    ? 'bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]'
                    : 'hover:bg-[#121820]',
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
