import { useEffect, useMemo, useRef, useState } from 'react'
import type { SearchTarget } from '../data/configSearch'
import { useMessages } from '../i18n/I18nProvider'
import { searchConfig } from '../utils/configSearch'
import { TAB_COLOR } from './HomeIdlePanel'

interface ConfigSearchProps {
  onNavigate: (target: SearchTarget) => void
  disabled?: boolean
}

function resultColor(target: SearchTarget): string {
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

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        title={m.search.openTitle}
        aria-label={m.search.label}
        className={[
          'flex h-14 min-w-14 items-center justify-center rounded-lg border px-3 transition-colors',
          'border-[#2a3340] bg-[#0d1117] text-[#6b7280] hover:border-[#4a5568] hover:text-[#9ca3af]',
          disabled ? 'pointer-events-none opacity-40' : '',
        ].join(' ')}
      >
        <SearchIcon className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-10 backdrop-blur-[2px] sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={m.search.label}
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto w-full max-w-xl rounded-lg border border-[#3a4555] bg-[#121820] p-4 shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-2">
              <SearchIcon className="h-4 w-4 shrink-0 text-[#6b7280]" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={m.search.placeholder}
                className="min-w-0 flex-1 rounded border border-[#2a3340] bg-[#0a0e14] px-3 py-2 text-sm text-white outline-none focus:border-[#4b5563]"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border border-[#2a3340] px-2 py-1 text-xs text-[#9ca3af] hover:border-[#4a5568]"
              >
                Esc
              </button>
            </div>
            <p className="mb-3 text-[10px] leading-relaxed text-[#4b5563]">
              {m.search.hint}
            </p>

            {query.trim() && results.length === 0 && (
              <p className="rounded border border-[#2a3340] bg-[#0d1117] px-3 py-4 text-center text-xs text-[#6b7280]">
                {m.search.noResults}
              </p>
            )}

            {results.length > 0 && (
              <ul className="max-h-[min(420px,60vh)] space-y-2 overflow-y-auto">
                {results.map((row) => {
                  const color = resultColor(row.target)
                  return (
                  <li key={row.entry.id}>
                    <button
                      type="button"
                      onClick={() => go(row.target)}
                      className="w-full rounded-lg border border-[#2a3340] bg-[#0d1117] px-3 py-2.5 text-left transition-colors hover:bg-[#141920]"
                      style={{
                        borderLeftWidth: 3,
                        borderLeftColor: color,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="text-sm font-semibold"
                          style={{ color }}
                        >
                          {row.title}
                        </span>
                        <span className="shrink-0 text-[10px] uppercase tracking-wider text-[#6b7280]">
                          {m.search.open}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#9ca3af]">
                        {row.body}
                      </p>
                      {row.command && (
                        <p className="mt-1.5 truncate font-mono text-[10px] text-[#6b7280]">
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
        </div>
      )}
    </>
  )
}
