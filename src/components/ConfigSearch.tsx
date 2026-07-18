import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { SearchTarget } from '../data/configSearch'
import { landingByPath } from '../data/seoLandings'
import { accentColorForTopic } from '../data/seoTheme'
import { useMessages } from '../i18n/I18nProvider'
import { searchConfig } from '../utils/configSearch'
import { TAB_COLOR } from './HomeIdlePanel'

interface ConfigSearchProps {
  onNavigate: (target: SearchTarget) => void
  disabled?: boolean
  /** Pulse the chip (e.g. welcome arrow points here) */
  hintPulse?: boolean
}

function resultColor(target: SearchTarget): string {
  if (target.type === 'guide') {
    const landing = landingByPath(target.path)
    return landing ? accentColorForTopic(landing.topic) : TAB_COLOR.utilities
  }
  if (target.type === 'tab') return TAB_COLOR[target.tab]
  return TAB_COLOR.utilities
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M16 16 L20 20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ConfigSearch({
  onNavigate,
  disabled = false,
  hintPulse = false,
}: ConfigSearchProps) {
  const m = useMessages()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => searchConfig(query, m), [query, m])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (disabled && open) setOpen(false)
  }, [disabled, open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (!disabled) setOpen(true)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [disabled, open])

  const go = (target: SearchTarget) => {
    onNavigate(target)
    setOpen(false)
    setQuery('')
  }

  const dialog =
    open &&
    createPortal(
      <div
        className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/65 px-4 py-10 backdrop-blur-md sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-label={m.search.label}
        onClick={() => setOpen(false)}
      >
        <div
          className="ui-panel panel-enter relative mx-auto w-full max-w-xl p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative z-[1] mb-3 flex items-center gap-2">
            <SearchIcon className="h-4 w-4 shrink-0 text-[var(--accent-muted)]" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={m.search.placeholder}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition-shadow focus:border-[var(--accent)]/70 focus:shadow-[0_0_0_3px_rgba(var(--accent-rgb),0.2)]"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ui-btn-ghost !px-2.5 !py-1.5 text-[10px]"
            >
              Esc
            </button>
          </div>
          <p className="relative z-[1] mb-3 text-[10px] leading-relaxed text-[var(--text-dim)]">
            {m.search.hint}
          </p>

          {query.trim() && results.length === 0 && (
            <p className="relative z-[1] rounded-xl border border-white/10 bg-black/30 px-3 py-4 text-center text-xs text-[var(--text-dim)]">
              {m.search.noResults}
            </p>
          )}

          {results.length > 0 && (
            <ul className="relative z-[1] max-h-[min(420px,60vh)] space-y-2 overflow-y-auto">
              {results.map((row) => {
                const isGuide =
                  row.kind === 'guide' || row.target.type === 'guide'
                const color = resultColor(row.target)
                return (
                  <li key={row.entry.id}>
                    <button
                      type="button"
                      onClick={() => go(row.target)}
                      className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                      style={{
                        borderLeftWidth: 3,
                        borderLeftColor: color,
                        boxShadow: `inset 3px 0 12px -6px ${color}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="text-sm font-semibold"
                          style={{ color }}
                        >
                          {row.title}
                        </span>
                        <span className="shrink-0 text-[10px] uppercase tracking-wider text-[var(--text-dim)]">
                          {isGuide ? m.search.guideBadge : m.search.open}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-[var(--text-muted)]">
                        {row.body}
                      </p>
                      {row.command && (
                        <p className="mt-1.5 truncate font-mono text-[10px] text-[var(--text-dim)]">
                          {m.search.example}: {row.command}
                        </p>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>,
      document.body,
    )

  return (
    <>
      <button
        id="bindlab-search"
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        title={m.search.openTitle}
        aria-label={m.search.label}
        className={[
          'ui-chip text-[#7a8799] hover:text-[var(--text-muted)]',
          disabled ? 'pointer-events-none opacity-40' : '',
          hintPulse
            ? 'animate-pulse ring-2 ring-sky-400/70 ring-offset-2 ring-offset-[#05080e] text-sky-300'
            : '',
        ].join(' ')}
      >
        <SearchIcon className="h-4 w-4" />
      </button>
      {dialog}
    </>
  )
}
